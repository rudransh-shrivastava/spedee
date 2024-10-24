import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({
      message: "Unauthorized",
      status: 401,
      error: true,
      success: false,
    });
  }
  if (session.user.role !== "vendor") {
    return Response.json({
      message: "Forbidden",
      status: 403,
      error: true,
      success: false,
    });
  }
  await connectDB();
  const vendorEmail = session.user.email;
  const orders = await Order.find({ "products.vendorEmail": vendorEmail });
  console.log(orders);
  return Response.json({ orders });
  // TODO: Implement this
}
