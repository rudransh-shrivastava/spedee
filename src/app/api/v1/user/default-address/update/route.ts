import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

export const addressZodSchema = z.object({
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" }),
  city: z.string().min(3, { message: "City must be at least 3 characters" }),
  state: z.string().min(3, { message: "State must be at least 3 characters" }),
  zip: z.string().min(6, { message: "Zip code must be at least 6 characters" }),
});
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
  await connectDB();
  const userEmail = session?.user?.email;
  const data = await req.json();
  const { address } = data;
  if (!address) {
    return Response.json({
      message: "field 'address' is required",
      status: 400,
      error: true,
      success: false,
    });
  }
  const result = addressZodSchema.safeParse(data);
  if (!result.success) {
    return Response.json({
      message: "Invalid data",
      status: 400,
      error: result.error,
      success: false,
    });
  }
  await User.findOneAndUpdate({ email: userEmail }, { address });
  return Response.json({
    message: "Address updated successfully",
    status: 200,
    success: true,
  });
}
