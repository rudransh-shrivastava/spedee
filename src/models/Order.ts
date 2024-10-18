import mongoose, { Document, Model } from "mongoose";

type OrderType = {
  id: string;
  transactionId: string;
  amount: number;
  status: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  userEmail: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: string;
};

interface OrderInterface extends Omit<OrderType, "id">, Document {}

const OrderSchema = new mongoose.Schema<OrderInterface>({
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  userEmail: { type: String, required: true },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
});

const Order: Model<OrderInterface> =
  mongoose.models.Order || mongoose.model<OrderInterface>("Order", OrderSchema);

export default Order;
