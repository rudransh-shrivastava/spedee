import { Model } from "mongoose";
import { connectDB } from "./mongodb";
interface PaginatedResults<T> {
  next?: {
    page: number;
    limit: number;
  };
  previous?: {
    page: number;
    limit: number;
  };
  results: T[];
}
export async function paginatedResults<T>(
  model: Model<T>,
  page: number,
  limit: number,
  constraints: Record<string, unknown> = {}
): Promise<PaginatedResults<T>> {
  await connectDB();
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results: PaginatedResults<T> = { results: [] };

  if (endIndex < (await model.countDocuments(constraints).exec())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = await model
    .find(constraints)
    .limit(limit)
    .skip(startIndex)
    .exec();
  return results;
}
