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
  type VendorOrder = {
    productId: string;
    quantity: number;
    pricePaid: number;
  };
  const vendorOrders: VendorOrder[] = [];
  orders.forEach((order) => {
    order.products.forEach((product) => {
      if (product.vendorEmail === vendorEmail) {
        vendorOrders.push({
          productId: product.productId,
          quantity: product.quantity,
          pricePaid: product.pricePaid,
        });
      }
    });
  });
  return Response.json({
    message: vendorOrders,
    error: false,
    success: true,
  });
}
