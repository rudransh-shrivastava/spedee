import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import z from "zod";
import Cart from "@/models/Cart";

const CartItemZodSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const cartItem = CartItemZodSchema.safeParse(data);
  console.log(data);

  if (!cartItem.success) {
    return Response.json({ message: cartItem.error, error: true });
  }
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userEmail = session.user.email;
  const cart = await Cart.findOne({ userEmail });
  // TODO: check if productId is valid
  if (!cart) {
    await Cart.create({
      userEmail,
      items: [cartItem.data],
    });
    return Response.json({ message: "Item added to cart", success: true });
  } else {
    const existingItem = cart.items.find(
      (item: { productId: string }) =>
        item.productId === cartItem.data.productId
    );
    if (existingItem) {
      // Update the quantity if the item exists
      if (cartItem.data.quantity === 0) {
        // Remove the item if the quantity is 0
        await Cart.findOneAndUpdate(
          { userEmail },
          { $pull: { items: { productId: cartItem.data.productId } } }
        );
        return Response.json({
          message: "Item removed from cart",
          success: true,
        });
      } else {
        // Update the quantity
        await Cart.findOneAndUpdate(
          { userEmail, "items.productId": cartItem.data.productId },
          { $set: { "items.$.quantity": cartItem.data.quantity } }
        );
        return Response.json({
          message: "Item quantity updated",
          success: true,
        });
      }
    } else {
      // Add the item if it doesn't exist
      await Cart.findOneAndUpdate(
        { userEmail },
        { $push: { items: cartItem.data } }
      );
      return Response.json({ message: "Item added to cart", success: true });
    }
  }
}
