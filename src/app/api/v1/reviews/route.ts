import { paginatedResults } from "@/lib/pagination";
import Review from "@/models/Review";
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

  const reviews = results.results.map((review) => {
    return {
      id: review.id,
      productId: review.productId,
      rating: review.rating,
      name: review.name,
      reviewTitle: review.reviewTitle,
      reviewDescription: review.reviewDescription,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  });

  const data = { ...results, results: reviews };
  return Response.json({ data, success: true, error: false });
}
