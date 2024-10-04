import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { zfd } from "zod-form-data";
import { S3Client } from "@aws-sdk/client-s3";

const productSchema = zfd.formData({
  productId: zfd.text(),
  name: zfd.text(),
  description: zfd.text(),
  priceInPaise: zfd.numeric(),
  salePriceInPaise: zfd.numeric(),
  attributes: zfd.text(),
  image: zfd.file(),
  otherImages: zfd.repeatableOfType(zfd.file()),
  category: zfd.text(),
  stock: zfd.numeric(),
  bestSeller: zfd.text(),
  bestSellerPriority: zfd.numeric(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "vendor") {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }
  await connectDB();

  const data = await req.formData();
  console.log(data);
  const product = productSchema.safeParse(data);
  if (!product.success) {
    console.log(product.error);
    return Response.json({ message: "Invalid data" }, { status: 400 });
  }
  const client = new S3Client({ region: process.env.AWS_REGION });
  console.log(product.data);
  return Response.json({ message: "Success" });
}
