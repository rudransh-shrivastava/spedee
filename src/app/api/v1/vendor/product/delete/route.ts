import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { deleteFile } from "@/lib/s3";
import Cart from "@/models/Cart";
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

  const deleteFilePromises = [];
  for (const variant of product.variants) {
    deleteFilePromises.push(deleteFile(variant.image));
    if (variant.otherImages) {
      variant.otherImages.forEach((image) => {
        deleteFilePromises.push(deleteFile(image));
      });
    }
  }

  console.log("deleting product files");
  await Promise.all(deleteFilePromises);
  console.log("deleting product");
  // remove prodcut from cart
  await Cart.updateMany(
    { "products.productId": productId },
    { $pull: { products: { productId } } }
  );
  await Product.deleteOne({ _id: productId });
  return Response.json({ message: "Product deleted" });
}
