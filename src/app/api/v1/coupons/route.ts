import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { paginatedResults } from "@/lib/pagination";
import Coupon from "@/models/Coupon";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({
      message: "Unauthorized",
      status: 401,
      error: true,
      success: false,
    });
  }
  if (session.user.role !== "admin") {
    return Response.json({
      message: "Forbidden",
      status: 403,
      error: true,
      success: false,
    });
  }
  await connectDB();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") as string) || 1;
  const limit = parseInt(searchParams.get("limit") as string) || 10;

  const results = await paginatedResults(Coupon, page, limit);

  const data = { ...results, results: results.results };
  return Response.json({ data, success: true, error: false });
}
