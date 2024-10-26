import { authOptions } from "@/lib/auth";
import Coupon from "@/models/Coupon";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

// validates if the coupon applied is valid
// returns true or false
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
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const categoryId = searchParams.get("categoryId");
  const couponCode = searchParams.get("coupon");
  if (!couponCode) {
    return Response.json({
      message: "Coupon code is required",
      status: 400,
      error: true,
      scuccess: false,
    });
  }
  const coupon = await Coupon.findOne({
    code: couponCode,
    isActive: true,
  });

  if (coupon?.productIds) {
    for (const prod of coupon?.productIds) {
      if (productId === prod) {
        return Response.json({
          message: "Coupon is valid",
          status: 200,
          error: false,
          success: true,
        });
      }
    }
    if (coupon?.categoryIds) {
      for (const catg of coupon?.categoryIds) {
        if (categoryId === catg) {
          return Response.json({
            message: "Coupon is valid",
            status: 200,
            error: false,
            success: true,
          });
        }
      }
    }
  }
  return Response.json({
    message: "Invalid Coupon",
    status: 404,
    error: true,
    success: false,
  });
}
