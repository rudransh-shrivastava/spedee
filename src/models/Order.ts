import mongoose, { Document, Model } from "mongoose";
import z from "zod";

const OrderZodSchema = z.object({
  id: z.string(),
  transactionId: z.string(),
  amount: z.number(),
  status: z.string(),
  products: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
    })
  ),
  userEmail: z.string(),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  paymentMethod: z.string(),
});

type OrderType = z.infer<typeof OrderZodSchema>;

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
