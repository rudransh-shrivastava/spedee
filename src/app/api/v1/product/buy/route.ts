import { connectDB } from "@/lib/mongodb";
import { NextRequest } from "next/server";

// TODO: implement
export async function POST(req: NextRequest) {
  await connectDB();
  console.log(req);
}
