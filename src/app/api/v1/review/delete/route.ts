import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
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
  const userEmail = session.user.email || "";
  const { reviewId } = await req.json();
  if (!reviewId) {
    return Response.json({
      message: "reviewId is required",
      status: 400,
      success: false,
      error: true,
    });
  }
  await connectDB();
  const review = await Review.findById(reviewId);
  if (!review) {
    return Response.json({
      message: "Review not found",
      status: 404,
      success: false,
      error: true,
    });
  }
   if (review.userEmail !== userEmail || session.user.role !== "admin") {
     return Response.json({
       message: "Unauthorized",
       status: 401,
       success: false,
       error: true,
     });
   }
}
