import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  await connectDB();
  const categories: Array<{
    _id: string;
    name: string;
    parentCategoryId: string | undefined;
  }> = await Category.find();

  const buildCategoryTree = (
    parentId: string | undefined
  ): Array<{
    name: string;
    parentCategoryId: string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: any[];
  }> => {
    return categories
      .filter((category) => category.parentCategoryId === parentId)
      .map((category) => ({
        name: category.name,
        parentCategoryId: category.parentCategoryId,
        children: buildCategoryTree(category._id),
      }));
  };

  const categoryTree = buildCategoryTree(undefined);

  return Response.json(categoryTree);
}
