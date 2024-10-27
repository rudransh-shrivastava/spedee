import mongoose, { Document, Model } from "mongoose";
import z from "zod";

export const reviewZodSchema = z.object({
  productId: z.string({
    required_error: "Product ID is required.",
    invalid_type_error: "Product ID must be a string.",
  }),
  rating: z
    .number()
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must be at most 5.")
    .refine((val) => Number.isInteger(val), "Rating must be an integer."),
  name: z.string().min(3, "Name must be at least 3 characters long."),
  reviewTitle: z
    .string()
    .min(3, "Review title must be at least 3 characters long."),
  reviewDescription: z
    .string()
    .min(10, "Review description must be at least 10 characters long."),
});
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
