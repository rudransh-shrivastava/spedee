import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";
import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
// TODO: only allow authenticated users to access this route
// TODO: only allow customers' order status to be checked by the customer
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const merchantTransactionId = searchParams.get("transactionId");
  if (!merchantTransactionId) {
    return NextResponse.json(
      { message: "Invalid transaction ID" },
      { status: 400 }
    );
  }
  const order = await Order.findOne({
    transactionId: merchantTransactionId,
  });
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }
  if (order.paymentStatus === "COMPLETED") {
    return NextResponse.json({ message: "COMPLETED", success: true });
  } else if (order.paymentStatus === "FAILED") {
    return NextResponse.json({ message: "FAILED", success: false });
  }
  const merchantId = process.env.PHONEPE_MERCHANT_ID;
  // SHA256(“/pg/v1/status/{merchantId}/{merchantTransactionId}” + saltKey) + “###” + saltIndex
  const saltKey = process.env.PHONEPE_SALT_KEY;
  const saltIndex = process.env.PHONEPE_SALT_KEY_INDEX;
  const endpoint = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
  const checksumString = endpoint + saltKey;
  const sha256 = crypto
    .createHash("sha256")
    .update(checksumString)
    .digest("hex");
  const checksum = sha256 + "###" + saltIndex;
  console.log("calculated to check status checksum is:", checksum);
  const phonepeUrl = process.env.PHONEPE_URL;
  const prod_URL = `${phonepeUrl}/pg/v1/status/${merchantId}/${merchantTransactionId}`;

  const requestData = {
    method: "GET",
    url: prod_URL,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    },
  };
  console.log("sent base64 payload: ", requestData);
  axios.request(requestData).then(async function (response) {
    // update order status depending on fail or success
    console.log("response from status api", response.data);
    const status = response.data.data.state;
    await Order.updateOne(
      { transactionId: merchantTransactionId },
      { status: status }
    );
  });

  return NextResponse.json({ message: "Hello" });
}
