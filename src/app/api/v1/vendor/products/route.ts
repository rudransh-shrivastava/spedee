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
      return {
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        attributes: product.attributes,
        category: product.category,
        bestSeller: product.bestSeller,
        bestSellerPriority: product.bestSellerPriority,
        variants: product.variants.map((variant) => {
          return {
            id: variant.id,
            attributes: variant.attributes,
            stock: variant.stock,
            priceInPaise: variant.priceInPaise,
            salePriceInPaise: variant.salePriceInPaise,
            image: getPublicImageUrl(variant.image),
            otherImages: variant.otherImages.map(getPublicImageUrl),
          };
        }),
      };
    }
  );

  return Response.json({ products });
}
