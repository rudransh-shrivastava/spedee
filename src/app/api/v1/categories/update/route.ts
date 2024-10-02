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
    return Response.json({ message: category.error.errors }, { status: 400 });
  }

  const exisingCategory = await Category.findOne({
    name: category.data.name,
  });
  if (exisingCategory) {
    await Category.updateOne(
      { name: category.data.name },
      {
        name: category.data.name,
        parentCategoryId: category.data.parentCategoryId,
      }
    );
    return Response.json({ message: "Category updated successfully" });
  }
  await Category.create({
    name: category.data.name,
    parentCategoryId: category.data.parentCategoryId,
  });
  return Response.json({ message: "Category created successfully" });
}
