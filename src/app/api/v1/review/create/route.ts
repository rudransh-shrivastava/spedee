import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Review, { reviewZodSchema } from "@/models/Review";
import axios from "axios";
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
  const productId = "";
  const isPurchased = await axios.get(
    `${process.env.NEXTAUTH_URL}/api/v1/product/purchased?productId=${productId}`
  );
  if (!isPurchased) {
    return Response.json({
      message: "You must purchase the product to review it.",
      status: 400,
      success: false,
      error: true,
    });
  }
  await connectDB();
  const existingReview = await Review.findOne({
    productId,
    userEmail: session.user.email,
  });
  if (existingReview) {
    return Response.json({
      message: "You have already reviewed this product.",
      status: 400,
      success: false,
      error: true,
    });
  }
  const data = await req.json();
  const result = reviewZodSchema.safeParse(data);
  if (!result.success) {
    return Response.json({
      message: "Invalid data.",
      status: 400,
      success: false,
      error: result.error.format(),
    });
  }
  const userEmail = session.user.email;
  result.data.name = session.user.name as string;

  const review = {
    ...result.data,
    userEmail,
    likeCount: 0,
    dislikeCount: 0,
  };
  await Review.create(review);
  return Response.json({ data: review, success: true, error: false });
}
