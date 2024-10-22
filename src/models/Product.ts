import mongoose, { Document, Model } from "mongoose";

export type VariantType = {
  attributes: Record<string, string>;
  stock: number;
  image: string;
  priceInPaise: number;
  salePriceInPaise: number;
  otherImages: string[];
};

export type ProductType = {
  id: string;
  name: string;
  description: string;
  attributes: Record<string, string[]>;
  category: string;
  bestSeller: boolean;
  bestSellerPriority: number;
  variants: VariantType[];
};

interface ProductInterface extends Omit<ProductType, "id">, Document {
  vendorEmail: string;
}

const VariantSchema = new mongoose.Schema<VariantType>({
  attributes: { type: Map, of: String, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true },
  otherImages: { type: [String], required: false },
  priceInPaise: { type: Number, required: true },
  salePriceInPaise: { type: Number, required: false },
});

const ProductSchema = new mongoose.Schema<ProductInterface>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  attributes: { type: Map, of: [String], required: true },
  vendorEmail: { type: String, required: true },
  category: { type: String, required: true },
  bestSeller: { type: Boolean, required: true },
  bestSellerPriority: { type: Number, required: true },
  variants: { type: [VariantSchema], required: true },
});

const Product: Model<ProductInterface> =
  mongoose.models.Product ||
  mongoose.model<ProductInterface>("Product", ProductSchema);

export default Product;
