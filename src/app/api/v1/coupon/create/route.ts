import { authOptions } from "@/lib/auth";
import Coupon, { CouponZodSchema } from "@/models/Coupon";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({
      message: "Unauthorized",
      status: 401,
      success: false,
      error: true,
    });
  }
  if (session.user.role !== "admin") {
    return Response.json({
      message: "Unauthorized",
      status: 401,
      success: false,
      error: true,
    });
  }
  const data = await req.json();
  const coupon = CouponZodSchema.safeParse(data);
  if (!coupon.success) {
    return Response.json({
      message: coupon.error.errors,
      status: 400,
      success: false,
      error: true,
    });
  }
  const couponData = coupon.data;
  const createdCoupon = await Coupon.create(couponData);
  return Response.json({
    message: "Coupon created successfully",
    status: 201,
    success: true,
    error: false,
    data: createdCoupon,
  });
}
