import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductType } from "@/models/Product";

export async function GET() {
  await connectDB();

  const data = await Product.find();

  const products: (Omit<ProductType, "vendorEmail"> & { id: string })[] =
    data.map((product): Omit<ProductType, "vendorEmail"> & { id: string } => ({
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      priceInPaise: product.priceInPaise,
      salePriceInPaise: product.salePriceInPaise,
      attributes: product.attributes,
      image: product.image,
      otherImages: product.otherImages,
      category: product.category,
      stock: product.stock,
      bestSeller: product.bestSeller,
      bestSellerPriority: product.bestSellerPriority,
      variants: product.variants,
    }));

  return Response.json({ products });
}
/*
returns products{} from models/Product.ts omits vendorEmail and adds id
*/
