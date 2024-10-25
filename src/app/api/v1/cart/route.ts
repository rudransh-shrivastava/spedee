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
  if (!cart) {
    return Response.json({ message: "Cart not found" }, { status: 404 });
  }
  const cartProductsIds = cart.items;
  const productsPromises = cartProductsIds.map(async (item) => {
    const product = await Product.findById(item.productId);
    if (!product) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }
    const productObject: ProductType & { selectedVariantId: string } = {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      attributes: product.attributes,
      category: product.category,
      bestSeller: product.bestSeller,
      bestSellerPriority: product.bestSellerPriority,
      selectedVariantId: item.variantId,
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
    return { product: productObject, quantity: item.quantity };
  });
  const products = await Promise.all(productsPromises!);
  const cartData = {
    id: cart?.id,
    items: products,
  };
  console.log(cartData);
  return Response.json(cartData);
}
