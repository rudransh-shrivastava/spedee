import mongoose, { Document, Model } from "mongoose";

enum Day {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}
export type VendorType = {
  name: string;
  location: { lat: number; lng: number };
  phoneNo: string;
  address: string;
  isOpen: boolean;
  openDays: string[];
  openTime: { day: string; openingTime: string; closingTime: string }[];
};

interface VendorInterface extends VendorType, Document {}

const VendorSchema = new mongoose.Schema<VendorInterface>({
  name: { type: String, required: true },
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
