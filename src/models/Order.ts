import mongoose, { Document, Model } from "mongoose";

type OrderType = {
  id: string;
  name: string;
  phone: string;
  transactionId: string;
  amount: number;
  paymentStatus: string;
  products: {
    productId: string;
    quantity: number;
    vendorEmail: string;
    status: string;
  }[];
  userEmail: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: string;
  paymentTransactionId?: string;
};

interface OrderInterface extends Omit<OrderType, "id">, Document {}

const OrderSchema = new mongoose.Schema<OrderInterface>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      vendorEmail: { type: String, required: true },
      status: { type: String, required: true },
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
  paymentTransactionId: { type: String, required: false },
});

const Order: Model<OrderInterface> =
  mongoose.models.Order || mongoose.model<OrderInterface>("Order", OrderSchema);

export default Order;
