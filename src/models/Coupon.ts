import mongoose, { Document, Model } from "mongoose";
import z from "zod";

export const CouponZodSchema = z.object({
  code: z.string(),
  discount: z.number(),
  discountType: z.enum(["percentage", "fixed", "delivery-free"]),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  isActive: z.boolean(),
});
type CouponType = z.infer<typeof CouponZodSchema> & { id: string };

interface CouponInterface extends Omit<CouponType, "id">, Document {}

const CouponSchema = new mongoose.Schema<CouponInterface>({
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  discountType: { type: String, required: true },
  productIds: { type: [String], required: false },
  categoryIds: { type: [String], required: false },
  isActive: { type: Boolean, required: true },
});

const Coupon: Model<CouponInterface> =
  mongoose.models.Coupon ||
  mongoose.model<CouponInterface>("Coupon", CouponSchema);

export default Coupon;
