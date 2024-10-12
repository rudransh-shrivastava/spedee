import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getPublicImageUrl } from "@/lib/s3";
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
