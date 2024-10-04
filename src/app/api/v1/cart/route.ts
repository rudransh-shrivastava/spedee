import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
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
    return { product, quantity: item.quantity };
  });
  const products = await Promise.all(productsPromises!);
  const cartData = {
    id: cart?.id,
    items: products,
  };
  console.log(cartData);
  return Response.json(cartData);
}
