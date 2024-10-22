import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { deleteFile } from "@/lib/s3";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "vendor") {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const product = await Product.findById(productId);
  if (!product) {
    return Response.json({ message: "Product not found" }, { status: 404 });
  }
  const vendorEmail = session.user.email;

  if (product?.vendorEmail != vendorEmail) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const uploadedImage = product?.image;
  const uploadedOtherImages = product?.otherImages;
  const deleteFilePromises = [];
  if (uploadedImage) {
    deleteFilePromises.push(deleteFile(uploadedImage));
  }
  if (uploadedOtherImages) {
    uploadedOtherImages.forEach((image) => {
      deleteFilePromises.push(deleteFile(image));
    });
  }
  console.log("deleting product files");
  await Promise.all(deleteFilePromises);
  console.log("deleting product");
  await Product.deleteOne({ _id: productId });
  return Response.json({ message: "Product deleted" });
}
