import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import z from "zod";
/*
TODO: Left out properties to save
- image
- otherImages
- vendorEmail
*/
const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  priceInPaise: z.number(),
  salePriceInPaise: z.number(),
  attributes: z.record(z.array(z.string())),
  category: z.string(),
  stock: z.number(),
  bestSeller: z.boolean(),
  bestSellerPriority: z.number(),
});

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "vendor") {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }
}
