import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product, { ProductType } from "@/models/Product";
import { getServerSession } from "next-auth";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "vendor") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const vendorEmail = session.user.email;

  const data = await Product.find({ vendorEmail });

  const products: ProductType[] = data.map((product) => ({
    productId: product._id as string,
    title: product.title,
    description: product.description,
    priceInPaise: product.priceInPaise,
    salePriceInPaise: product.salePriceInPaise,
    attributes: product.attributes,
    image: product.image,
    otherImages: product.otherImages,
    vendorEmail: product.vendorEmail,
    category: product.category,
    stock: product.stock,
    bestSeller: product.bestSeller,
    bestSellerPriority: product.bestSellerPriority,
  }));

  return Response.json({ products });
}
