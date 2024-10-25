import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
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
    name: string;
    productId: string;
    image: string;
    status: string;
    quantity: number;
    pricePaid: number;
  };
  orders.forEach((order) => {
    order.products.forEach(async (product) => {
      const dbProduct = await Product.findById(product.productId);
      if (!dbProduct) {
        return Response.json({
          message: "Invalid product",
          status: 400,
          error: true,
          success: false,
        });
      }
      userOrders.push({
        name: dbProduct.name,
        status: product.status,
        productId: product.productId,
        image: dbProduct.variants[0].image,
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
