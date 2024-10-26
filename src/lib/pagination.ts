import { Model } from "mongoose";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constraints?: any
): Promise<PaginatedResults<T>> {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results: PaginatedResults<T> = { results: [] };

  if (endIndex < (await model.countDocuments().exec())) {
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
