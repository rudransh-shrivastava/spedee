import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import User from "@/models/User";
import { addressZodSchema } from "@/models/Order";

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
    { $set: { addresses: address } }
  );
  return Response.json({
    message:
      "Address updated successfully but this api does not work as i have not tested it yet so if it doesnt work please dont kill me",
    status: 200,
    success: true,
  });
}
