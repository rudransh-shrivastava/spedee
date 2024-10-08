import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Category, { CategoryZodSchema } from "@/models/Category";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const data = await req.json();
  const category = CategoryZodSchema.safeParse(data);

  if (!category.success) {
    return Response.json(
      { message: category.error.errors, error: true, success: false },
      { status: 400 }
    );
  }
  const exisingCategory = await Category.findOne({ name: category.data.name });
  if (exisingCategory) {
    return Response.json(
      { message: "Category already exists" },
      { status: 400 }
    );
  }
  const createdCategory = await Category.create({
    name: category.data.name,
    isParent: category.data.isParent,
    parentCategoryId: category.data.parentCategoryId,
  });
  return Response.json({
    message: "Category created successfully",
    success: true,
    error: false,
    id: createdCategory.id,
    category: {
      id: createdCategory._id,
      name: createdCategory.name,
      isParent: createdCategory.isParent,
      parentCategoryId: createdCategory.parentCategoryId,
    },
  });
}
