import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductType } from "@/models/Product";

export async function GET() {
  await connectDB();

  const data = await Product.find();

  const products: ProductType[] = data.map((product) => ({
    productId: product._id as string,
    name: product.name,
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
