import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Attribute, { AttributeZodSchema } from "@/models/Attribute";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const data = await req.json();

  const attribute = AttributeZodSchema.safeParse(data);
  if (!attribute.success) {
    return Response.json({ message: attribute.error.errors }, { status: 400 });
  }
  await Attribute.create({
    name: attribute.data.name,
    values: attribute.data.values,
  });
  return Response.json({ message: "Attribute created" });
}
