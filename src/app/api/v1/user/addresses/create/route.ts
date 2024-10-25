import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { addressZodSchema } from "../../default-address/update/route";
import User from "@/models/User";

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
  const userEmail = session?.user?.email;
  await connectDB();
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
  await User.findOneAndUpdate(
    { email: userEmail },
    { $push: { addresses: address } }
  );
  return Response.json({
    message: "Address added successfully",
    status: 200,
    success: true,
  });
}
