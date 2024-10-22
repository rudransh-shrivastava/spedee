import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getPublicImageUrl } from "@/lib/s3";
import Cart from "@/models/Cart";
import Product, { ProductType } from "@/models/Product";
import { getServerSession } from "next-auth";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;

  const cart = await Cart.findOne({
    userEmail,
  });
  const cartProductsIds = cart?.items;
  const productsPromises = cartProductsIds?.map(async (item) => {
    const product = await Product.findById(item.productId);
    const imageUrl = getPublicImageUrl(product?.image as string);
    const otherImagesUrls = product?.otherImages.map((image) =>
      getPublicImageUrl(image)
    );
    const formattedProduct: ProductType = {
      id: product?._id as string,
      name: product?.name ?? "",
      description: product?.description ?? "",
      priceInPaise: product?.priceInPaise ?? -1,
      salePriceInPaise: product?.salePriceInPaise ?? -1,
      attributes: product?.attributes ?? {},
      image: imageUrl,
      otherImages: otherImagesUrls ?? [],
      category: product?.category ?? "",
      stock: product?.stock ?? -1,
      bestSeller: product?.bestSeller ?? false,
      bestSellerPriority: product?.bestSellerPriority ?? -1,
      variants: product?.variants ?? [],
    };
    return { product: formattedProduct, quantity: item.quantity };
  });
  const products = await Promise.all(productsPromises!);
  const cartData = {
    id: cart?.id,
    items: products,
  };
  console.log(cartData);
  return Response.json(cartData);
}
