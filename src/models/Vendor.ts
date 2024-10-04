import mongoose, { Document, Model } from "mongoose";
import z from "zod";
// enum Day {
//   MONDAY = "MONDAY",
//   TUESDAY = "TUESDAY",
//   WEDNESDAY = "WEDNESDAY",
//   THURSDAY = "THURSDAY",
//   FRIDAY = "FRIDAY",
//   SATURDAY = "SATURDAY",
//   SUNDAY = "SUNDAY",
// }

export const VendorZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  location: z.object({ lat: z.number(), lng: z.number() }),
  phoneNo: z.string(),
  address: z.string(),
  isOpen: z.boolean(),
  openDays: z.array(z.string()),
  openTime: z.array(
    z.object({
      day: z.string(),
      openingTime: z.string(),
      closingTime: z.string(),
    })
  ),
});

export type VendorType = z.infer<typeof VendorZodSchema>;

interface VendorInterface extends Omit<VendorType, "id">, Document {}

const VendorSchema = new mongoose.Schema<VendorInterface>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: { lat: Number, lng: Number }, required: true },
  phoneNo: { type: String, required: true },
  address: { type: String, required: true },
  isOpen: { type: Boolean, required: true },
  openDays: { type: [String], required: true },
  openTime: {
    type: [{ day: String, openingTime: String, closingTime: String }],
    required: true,
  },
});

const Vendor: Model<VendorInterface> =
  mongoose.models.Vendor ||
  mongoose.model<VendorInterface>("Vendor", VendorSchema);

export default Vendor;
