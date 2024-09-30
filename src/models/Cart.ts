import mongoose, { Document, Model } from "mongoose";

type CartItemType = {
  productId: string;
  quantity: number;
};

export type CartType = {
  userEmail: string;
  items: CartItemType[];
};

interface CartInterface extends CartType, Document {}

const CartSchema = new mongoose.Schema<CartInterface>({
  userEmail: { type: String, required: true },
  items: { type: [{ type: mongoose.Schema.Types.Mixed }], required: true },
});

const Cart: Model<CartInterface> =
  mongoose.models.Cart || mongoose.model<CartInterface>("Cart", CartSchema);

export default Cart;
