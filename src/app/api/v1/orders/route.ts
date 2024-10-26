import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { paginatedResults } from "@/lib/pagination";
import { getPublicImageUrl } from "@/lib/s3";
import Order from "@/models/Order";
import Product from "@/models/Product";
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
  await connectDB();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") as string) || 1;
  const limit = parseInt(searchParams.get("limit") as string) || 10;
  const userEmail = session.user.email;
  const results = await paginatedResults(Order, page, limit, { userEmail });

  // TODO: remove type from here
  type UserOrder = {
    name: string;
    productId: string;
    image: string;
    status: string;
    quantity: number;
    pricePaid: number;
  };
  const userOrders: UserOrder[] = [];
  for (const order of results.results) {
    for (const product of order.products) {
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
        image: getPublicImageUrl(dbProduct.variants[0].image),
        quantity: product.quantity,
        pricePaid: product.pricePaid,
      });
    }
  }
  const data = { ...results, results: userOrders };
  return Response.json({ data, success: true, error: false });
}
