import mongoose, { Document, Model } from "mongoose";

type CartItemType = {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
};

export type CartType = {
  id: string;
  userEmail: string;
  items: Omit<CartItemType, "id">[];
};

interface CartInterface extends Omit<CartType, "id">, Document {}

const CartSchema = new mongoose.Schema<CartInterface>({
  userEmail: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      variantId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const Cart: Model<CartInterface> =
  mongoose.models.Cart || mongoose.model<CartInterface>("Cart", CartSchema);

export default Cart;
