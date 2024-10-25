import mongoose, { Document, Model } from "mongoose";
import { z } from "zod";

export const addressZodSchema = z.object({
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" }),
  city: z.string().min(3, { message: "City must be at least 3 characters" }),
  state: z.string().min(3, { message: "State must be at least 3 characters" }),
  zip: z.string().min(6, { message: "Zip code must be at least 6 characters" }),
});
type OrderType = {
  id: string;
  name: string;
  phone: string;
  transactionId: string;
  amount: number;
  paymentStatus: string;
  products: {
    productId: string;
    variantId: string;
    quantity: number;
    vendorEmail: string;
    status: string;
    pricePaid: number;
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
      variantId: { type: String, required: true },
      quantity: { type: Number, required: true },
      vendorEmail: { type: String, required: true },
      status: { type: String, required: true },
      pricePaid: { type: Number, required: true },
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
