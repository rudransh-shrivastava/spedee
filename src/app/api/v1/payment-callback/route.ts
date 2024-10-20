import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  const decodedResponse = Buffer.from(data.response, "base64").toString(
    "utf-8"
  );
  const parsedResponse = JSON.parse(decodedResponse);
  console.log("Decoded response: ", parsedResponse);

  const { merchantTransactionId } = parsedResponse.data;
  if (!merchantTransactionId) {
    return NextResponse.json(
      { message: "Invalid transaction ID" },
      { status: 400 }
    );
  }
  // call /order/status API
  const statusResponse = axios.get(
    `${process.env.NEXTAUTH_URL}/api/v1/order/status?transactionId=${merchantTransactionId}`
  );
  return Response.json({ message: "Hello" });
}
