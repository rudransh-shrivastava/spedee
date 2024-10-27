import { reviewZodSchema } from "@/app/product/[id]/review/page";
import mongoose, { Document, Model } from "mongoose";
import z from "zod";

//  prouctId: string;
//  rating: number;
//  name: string;
//  reviewTitle: string;
//  reviewDescription: string;

type ReviewZodSchemaType = z.infer<typeof reviewZodSchema>;

interface ReviewType extends ReviewZodSchemaType {
  id: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewInterface extends Omit<ReviewType, "id">, Document {}

const ReviewSchema = new mongoose.Schema<ReviewInterface>(
  {
    productId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    reviewTitle: {
      type: String,
      required: true,
    },
    reviewDescription: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Review: Model<ReviewInterface> =
  mongoose.models.Review ||
  mongoose.model<ReviewInterface>("Review", ReviewSchema);

export default Review;
