import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
// import { paymentGateway } from "@/lib/phonepe";
import Order from "@/models/Order";
import axios from "axios";
import { getServerSession } from "next-auth";
import crypto from "crypto";

export async function POST() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userEmail = session.user.email;
  const amount = 500;
  const transactionId = generatedTranscId();
  const userId = session.user.email ?? "anonymous";
  const shippingAddress = {
    address: "123, Main Street",
    city: "Bangalore",
    state: "Karnataka",
    zip: "473005",
  };
  await Order.create({
    transactionId,
    amount,
    status: "PENDING",
    products: [], // TODO: Add products
    userEmail,
    shippingAddress,
    paymentMethod: "phonepe",
  });
  const ngrokUrl = process.env.PHONEPE_CALLBACK_URL; // Replace with your actual ngrok URL

  const payload = {
    merchantId: "PGTESTPAYUAT86", // Replace with your actual merchant ID
    merchantTransactionId: transactionId,
    merchantUserId: userId,
    amount,
    redirectUrl: `localhost:3000/payredirect`,
    redirectMode: "REDIRECT",
    callbackUrl: `${ngrokUrl}/api/v1/payment-callback`,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payloadString = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadString).toString("base64");

  const saltKey = "96434309-7796-489d-8924-ab56988a6076"; // Replace with your actual salt key
  const saltIndex = "1"; // Replace with your actual salt index
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
        data: response.data,
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
  return Response.json({ message: "Payment initiated", success: true });
}
function generatedTranscId() {
  return "T" + Date.now();
}
