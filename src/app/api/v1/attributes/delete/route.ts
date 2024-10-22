import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Attribute from "@/models/Attribute";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { searchParams } = new URL(req.url);
  const attributeId = searchParams.get("id");
  if (!attributeId) {
    return Response.json(
      {
        message: "Attribute ID not provided, please specify an 'id'",
        success: false,
      },
      { status: 400 }
    );
  }
  const attribute = await Attribute.findById(attributeId);
  if (!attribute) {
    return Response.json(
      { message: "Attribute not found", success: false },
      { status: 404 }
    );
  }
  await Attribute.deleteOne({ _id: attributeId });
  return Response.json({ message: "Attribute deleted", success: true });
}
