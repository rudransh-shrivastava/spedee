import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const categories = await Category.find().lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildCategoryTree: any = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories: any[],
    parentId: string | null = null
  ) => {
    return categories
      .filter((category) => category.parentCategoryId === parentId)
      .map((category) => ({
        id: category._id.toString(),
        name: category.name,
        isParent: category.isParent,
        parentCategoryId: category.parentCategoryId,
        children: buildCategoryTree(categories, category._id.toString()),
      }));
  };

  const categoryTree = buildCategoryTree(categories);

  return NextResponse.json(categoryTree);
}
