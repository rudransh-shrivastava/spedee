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
  if (session.user.role !== "vendor") {
    return Response.json({
      message: "Forbidden",
      status: 403,
      error: true,
      success: false,
    });
  }
  await connectDB();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") as string) || 1;
  const limit = parseInt(searchParams.get("limit") as string) || 10;

  const vendorEmail = session.user.email;
  const results = await paginatedResults(Order, page, limit, { vendorEmail });
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
  for (const order of results.results) {
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
          image: getPublicImageUrl(dbProduct.variants[0].image),
          quantity: product.quantity,
          pricePaid: product.pricePaid,
        });
      }
    }
  }
  const data = { ...results, results: vendorOrders };
  return Response.json({ data, success: true, error: false });
}
