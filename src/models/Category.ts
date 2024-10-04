import mongoose, { Document, Model } from "mongoose";
import { z } from "zod";

export const CategoryZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  isParent: z.boolean(),
  parentCategoryId: z.string().nullable(),
});

type CategoryType = z.infer<typeof CategoryZodSchema>;

interface CategoryInterface extends Omit<CategoryType, "id">, Document {}

const CategorySchema = new mongoose.Schema<CategoryInterface>({
  name: {
    type: String,
    required: true,
  },
  isParent: {
    type: Boolean,
    required: true,
  },
  parentCategoryId: {
    type: String || null,
    default: null,
  },
});

const Category: Model<CategoryInterface> =
  mongoose.models.Category ||
  mongoose.model<CategoryInterface>("Category", CategorySchema);

export default Category;
