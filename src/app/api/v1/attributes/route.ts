import { connectDB } from "@/lib/mongodb";
import Attribute from "@/models/Attribute";

export async function GET() {
  await connectDB();
  const attributes = await Attribute.find();
  return Response.json(attributes);
}
