import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import axios from "axios";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import z from "zod";
import { NextRequest } from "next/server";
import Product from "@/models/Product";

const zodSchema = z.object({
  name: z.string(),
  phone: z.string(),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  products: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
      attributes: z.array(z.record(z.string())),
    })
  ),
});

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const result = zodSchema.safeParse(data);
  if (!result.success) {
    return Response.json({ message: "Invalid data", error: result.error });
  }

  const { name, phone, shippingAddress, products } = result.data;
  const userEmail = session.user.email;
  const matchedProducts = [];
  let totalAmount = 5000;
  // TODO: Implement sale price, coupons, discounts, etc.
  for (const product of products) {
    const matchedProduct = await Product.findById(product.productId);
    if (!matchedProduct) {
      return Response.json({
        message: "Invalid product",
        status: 400,
        error: true,
        success: false,
      });
    }
    const matchedVariant = matchedProduct.variants.find(
      (variant) =>
        JSON.stringify(variant.attributes) ===
        JSON.stringify(product.attributes)
    );
    const variantPrice =
      matchedVariant?.salePriceInPaise ?? matchedVariant?.priceInPaise;
    if (!variantPrice) {
      return Response.json({
        message: "Invalid product",
        status: 400,
        error: true,
        success: false,
      });
    }
    const pricePaid = variantPrice * product.quantity;
    const vendorEmail = matchedProduct.vendorEmail;
    matchedProducts.push({
      productId: matchedProduct.id,
      quantity: product.quantity,
      vendorEmail,
      status: "PENDING",
      pricePaid,
    });
    totalAmount += pricePaid;
  }
  if (!matchedProducts) {
    return Response.json({ message: "Invalid product" }, { status: 400 });
  }
  const priceInPaise = totalAmount;
  const transactionId = generatedTranscId();
  const userId = session.user.email ?? "anonymous";

  await Order.create({
    name,
    phone,
    transactionId,
    amount: priceInPaise,
    paymentStatus: "PENDING",
    orderStatus: "INITIATED",
    products: matchedProducts,
    userEmail,
    shippingAddress,
    paymentMethod: "phonepe",
    paymentTransactionId: "",
  });
  const serverUrl = process.env.PHONEPE_CALLBACK_URL;
  const clientUrl = process.env.NEXTAUTH_URL;
  const payload = {
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: userId,
    amount: priceInPaise,
    redirectUrl: `${clientUrl}/order/status/${transactionId}`,
    redirectMode: "REDIRECT",
    callbackUrl: `${serverUrl}/api/v1/payment-callback`,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payloadString = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadString).toString("base64");

  const saltKey = process.env.PHONEPE_SALT_KEY;
  const saltIndex = process.env.PHONEPE_SALT_KEY_INDEX;
  const endpoint = "/pg/v1/pay";
  const checksumString = base64Payload + endpoint + saltKey;
  console.log("caluclated checksum string is:", checksumString);
  const sha256 = crypto
    .createHash("sha256")
    .update(checksumString)
    .digest("hex");
  const checksum = sha256 + "###" + saltIndex;
  console.log("calculated checksum is:", checksum);
  const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
  const requestData = {
    method: "POST",
    url: prod_URL,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    },
    data: {
      request: base64Payload,
    },
  };
  console.log("sent base64 payload: ", base64Payload);
  axios
    .request(requestData)
    .then(async function (response) {
      const phonePeTransactionId = response.data.transactionId;
      console.log("Payment API Response:", response.data);
      console.log(response.data.data.instrumentResponse);
      return Response.json({
        message: "Payment initiated",
        success: true,
        phonePeTransactionId,
        url: response.data.data.instrumentResponse.url,
      });
    })
    .catch(function (error) {
      console.error("Payment API Error:", error.message);
      return Response.json({
        message: "Payment failed",
        success: false,
        error: error.message,
      });
    });
  return Response.json({
    message: "Payment initiated (?)",
    url: null,
    success: true,
  });
}
function generatedTranscId() {
  return "T" + Date.now();
}
