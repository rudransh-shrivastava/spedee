import { authOptions } from "@/lib/auth";
import { paginatedResults } from "@/lib/pagination";
import Review, { ReviewType } from "@/models/Review";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) {
    return Response.json({
      message: "productId is required.",
      status: 400,
      success: false,
      error: true,
    });
  }
  const page = parseInt(searchParams.get("page") as string) || 1;
  const limit = parseInt(searchParams.get("limit") as string) || 10;
  const search = (searchParams.get("search") as string) || "";

  const constraints = search
    ? {
        productId,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { reviewTitle: { $regex: search, $options: "i" } },
          { reviewDescription: { $regex: search, $options: "i" } },
        ],
      }
    : {
        productId,
      };
  const results = await paginatedResults(Review, page, limit, constraints);
  const session = await getServerSession(authOptions);
  const userEmail = session?.user.email || "";
  const reviews: ReviewType[] = results.results.map((review) => {
    const isLiked = review.likes.includes(userEmail);
    const isDisliked = review.dislikes.includes(userEmail);
    return {
      id: review.id,
      productId: review.productId,
      rating: review.rating,
      name: review.name,
      reviewTitle: review.reviewTitle,
      reviewDescription: review.reviewDescription,
      likeCount: review.likeCount,
      isLiked,
      dislikeCount: review.dislikeCount,
      isDisliked,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  });
  const stats = {
    totalRatings: 10034,
    averageRating: parseFloat((4.5).toFixed(1)),
    ratings: {
      1: 100,
      2: 200,
      3: 300,
      4: 400,
      5: 500,
    },
  };
  const data = { ...results, results: reviews };
  return Response.json({ data, stats, success: true, error: false });
}
