import mongoose, { Document, Model } from "mongoose";

export type ProductType = {
  productId: string;
  title: string;
  description: string;
  priceInPaise: number;
  salePriceInPaise: number;
  attributes: Record<string, string[]>;
  image: string;
  otherImages: string[];
  vendorId: string;
  category: string;
  stock: number;
  bestSeller: boolean;
  bestSellerPriority: number;
};
interface ProductInterface extends ProductType, Document {}

const ProductSchema = new mongoose.Schema<ProductInterface>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priceInPaise: { type: Number, required: true },
  salePriceInPaise: { type: Number, required: false },
  attributes: { type: Object, required: true },
  image: { type: String, required: true },
  otherImages: { type: [String], required: false },
  vendorId: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  bestSeller: { type: Boolean, required: true },
  bestSellerPriority: { type: Number, required: true },
});

const Product: Model<ProductInterface> =
  mongoose.models.Product ||
  mongoose.model<ProductInterface>("Product", ProductSchema);

export default Product;
