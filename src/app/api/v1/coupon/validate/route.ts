import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const categoryId = searchParams.get("categoryId");
  return Response.json({ message: "to do", session, productId, categoryId });
}
