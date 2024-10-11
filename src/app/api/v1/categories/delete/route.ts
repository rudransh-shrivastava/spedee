import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
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
  const updatePromises = [];
  updatePromises.push(
    await Product.updateMany({ category: categoryId }, { category: null })
  );
  updatePromises.push(
    await Category.updateMany(
      {
        parentCategoryId: categoryId,
      },
      { parentCategoryId: null }
    )
  );
  await Promise.all(updatePromises);
  await Category.deleteOne({ _id: categoryId });
  return Response.json({
    message: "Category along with sub-categories deleted successfully",
    success: true,
    error: false,
  });
}
