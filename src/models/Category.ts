import mongoose, { Document, Model } from "mongoose";
import { z } from "zod";

export const CategoryZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentCategoryId: z.string().optional(),
});

type CategoryType = z.infer<typeof CategoryZodSchema>;

interface CategoryInterface extends Omit<CategoryType, "id">, Document {}

const CategorySchema = new mongoose.Schema<CategoryInterface>({
  name: {
    type: String,
    required: true,
  },
  parentCategoryId: {
    type: String,
    default: null,
  },
});

const Category: Model<CategoryInterface> =
  mongoose.models.Category ||
  mongoose.model<CategoryInterface>("Category", CategorySchema);

export default Category;
