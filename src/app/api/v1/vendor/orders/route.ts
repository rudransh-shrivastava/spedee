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
  // TODO: remove type from here
  type VendorOrder = {
    name: string;
    productId: string;
    image: string;
    status: string;
    quantity: number;
    pricePaid: number;
  };
  // TODO: exact variant return and status return correct

  const vendorOrders: VendorOrder[] = [];
  for (const order of orders) {
    for (const product of order.products) {
      if (product.vendorEmail === vendorEmail) {
        const dbProduct = await Product.findById(product.productId);
        if (!dbProduct) {
          return Response.json({
            message: "Invalid product",
            status: 400,
            error: true,
            success: false,
          });
        }
        vendorOrders.push({
          name: dbProduct.name,
          status: product.status,
          productId: product.productId,
          image: dbProduct.variants[0].image,
          quantity: product.quantity,
          pricePaid: product.pricePaid,
        });
      }
    }
  }
  return Response.json({
    message: vendorOrders,
    error: false,
    success: true,
  });
}
