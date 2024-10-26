import { authOptions } from "@/lib/auth";
import Coupon from "@/models/Coupon";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
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
      status: 401,
      error: true,
      success: false,
    });
  }
  const { searchParams } = new URL(req.url);
  const coupondId = searchParams.get("couponId");
  if (!coupondId) {
    return Response.json({
      message: "couponId is required",
      status: 400,
      error: true,
      success: false,
    });
  }
  await Coupon.findOneAndDelete({ _id: coupondId });
  return Response.json({ message: "Coupon deleted successfully" });
}
