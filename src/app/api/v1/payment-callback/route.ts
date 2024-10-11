import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const { transactionId, status } = await req.json();
  console.log("Payment STATUS IS HERE ::: ____");
  console.log(transactionId, status);
  if (status === "SUCCESS") {
    await updatePurchaseStatus(transactionId, "completed");
    return Response.json({ message: "Payment successful" });
  } else {
    await updatePurchaseStatus(transactionId, "failed");
    return Response.json({ message: "Payment failed" }, { status: 400 });
  }
}
async function updatePurchaseStatus(transactionId: string, status: string) {
  await Order.updateOne({ transactionId }, { status });
}
