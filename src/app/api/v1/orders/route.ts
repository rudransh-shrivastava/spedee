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
  await connectDB();
  const userEmail = session.user.email;
  const orders = await Order.find({ userEmail });
  const userOrders: UserOrder[] = [];
  // TODO: remove type from here
  type UserOrder = {
    productId: string;
    quantity: number;
    pricePaid: number;
  };
  orders.forEach((order) => {
    order.products.forEach((product) => {
      userOrders.push({
        productId: product.productId,
        quantity: product.quantity,
        pricePaid: product.pricePaid,
      });
    });
  });
  return Response.json({
    message: userOrders,
    error: false,
    success: true,
  });
}
