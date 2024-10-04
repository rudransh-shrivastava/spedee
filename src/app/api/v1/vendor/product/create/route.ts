import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
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

  const data = await req.formData();
  console.log(data);
  const productId = data.get("productId");
  const image = data.get("image");
  const otherImages = data.getAll("otherImages");
  console.log(productId, image, otherImages);
  return Response.json({ message: "Success" });
}
