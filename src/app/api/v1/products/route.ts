import { connectDB } from "@/lib/mongodb";
import { getPublicImageUrl } from "@/lib/s3";
import Product from "@/models/Product";
import { ProductType } from "@/models/Product";

export async function GET() {
  await connectDB();

  const data = await Product.find();

  const products: (ProductType & { id: string })[] = data.map(
    (product): ProductType & { id: string } => {
      const imageUrl = getPublicImageUrl(product.image);
      const otherImagesUrls = product.otherImages.map((image) =>
        getPublicImageUrl(image)
      );
      return {
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        priceInPaise: product.priceInPaise,
        salePriceInPaise: product.salePriceInPaise,
        attributes: product.attributes,
        image: imageUrl,
        otherImages: otherImagesUrls,
        category: product.category,
        stock: product.stock,
        bestSeller: product.bestSeller,
        bestSellerPriority: product.bestSellerPriority,
        variants: product.variants,
      };
    }
  );

  return Response.json({ products });
}
/*
returns products{} from models/Product.ts omits vendorEmail and adds id
*/
