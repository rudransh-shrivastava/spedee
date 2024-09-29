import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductType } from "@/models/Product";

export async function GET() {
  await connectDB();

  const data = await Product.find({ bestSeller: true });

  const products: ProductType[] = data.map((product) => ({
    productId: product._id as string,
    title: product.title,
    description: product.description,
    priceInPaise: product.priceInPaise,
    salePriceInPaise: product.salePriceInPaise,
    attributes: product.attributes,
    image: product.image,
    otherImages: product.otherImages,
    vendorId: product.vendorId,
    category: product.category,
    stock: product.stock,
    bestSeller: product.bestSeller,
    bestSellerPriority: product.bestSellerPriority,
  }));

  return new Response(JSON.stringify(products), {
    headers: { "Content-Type": "application/json" },
  });
}
