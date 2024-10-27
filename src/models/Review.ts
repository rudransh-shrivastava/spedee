import { reviewZodSchema } from "@/app/product/[id]/review/page";
import mongoose, { Document, Model } from "mongoose";
import z from "zod";

//  prouctId: string;
//  rating: number;
//  name: string;
//  reviewTitle: string;
//  reviewDescription: string;

type ReviewZodSchemaType = z.infer<typeof reviewZodSchema>;

export interface ReviewType extends ReviewZodSchemaType {
  id: string;
  likeCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  dislikeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewInterface extends Omit<ReviewType, "id">, Document {
  userEmail: string;
  likes: string[];
  dislikes: string[];
}

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
    likes: {
      type: [String],
      default: [],
    },
    likeCount: {
      type: Number,
      required: true,
    },
    dislikes: {
      type: [String],
      default: [],
    },
    dislikeCount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Review: Model<ReviewInterface> =
  mongoose.models.Review ||
  mongoose.model<ReviewInterface>("Review", ReviewSchema);

export default Review;
