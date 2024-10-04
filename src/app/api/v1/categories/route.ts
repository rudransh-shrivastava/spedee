import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const categories = await Category.find().lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildCategoryTree: any = (
    categories: any[],
    parentId: string | null = null
  ) => {
    return categories
      .filter((category) => category.parentCategoryId === parentId)
      .map((category) => ({
        ...category,
        children: buildCategoryTree(categories, category._id.toString()),
      }));
  };

  const categoryTree = buildCategoryTree(categories);

  return NextResponse.json(categoryTree);
}
