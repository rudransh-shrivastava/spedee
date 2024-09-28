import mongoose, { Document, Model } from "mongoose";

interface CategoryInterface extends Document {
  name: string;
  parentCategoryId: string;
}

const CategorySchema = new mongoose.Schema<CategoryInterface>({
  name: {
    type: String,
    required: true,
  },
  parentCategoryId: {
    type : String, 
    default : null
  }
});

const Category: Model<CategoryInterface> =
  mongoose.models.Category ||
  mongoose.model<CategoryInterface>("Category", CategorySchema);

export default Category;