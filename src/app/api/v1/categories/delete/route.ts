import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// TODO: if a category is deleted, also delete its subcategories and find products which have this category, set their categories to null
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
  const categoryId = data.id;
  if (!categoryId) {
    return Response.json(
      {
        message: "Category id is required, please specify id as id: string",
        error: true,
        success: false,
      },
      { status: 400 }
    );
  }

  await Category.deleteOne({ _id: categoryId });
  return Response.json({
    message: "Category deleted successfully",
    success: true,
    error: false,
  });
}
