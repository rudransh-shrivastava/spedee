import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({
      message: "Unauthorized",
      status: 401,
      error: true,
      success: false,
    });
  }
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) {
    return Response.json({
      message: "productId is required",
      status: 400,
      error: true,
      success: false,
    });
  }
  await connectDB();
  const userEmail = session.user.email;
  const potentialOrders = await Order.findOne({ userEmail });
  const order = potentialOrders?.products.find(
    (product) => product.productId === productId
  );
  if (order) {
    return Response.json({
      message: "Product already purchased",
      purchased: true,
      status: 400,
      error: true,
      success: false,
    });
  }
  return Response.json({
    message: "Product not purchased in the past",
    purchased: false,
    success: true,
    error: false,
  });
}
