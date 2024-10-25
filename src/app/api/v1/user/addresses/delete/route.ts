import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
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
  await connectDB();
  const userEmail = session.user.email;
  const data = await req.json();
  const { addressId } = data;
  if (!addressId) {
    return Response.json({
      message: "field 'addressId' is required",
      status: 400,
      error: true,
      success: false,
    });
  }
  await User.findOneAndUpdate(
    { email: userEmail },
    {
      $pull: { addresses: { _id: addressId } },
    }
  );
  return Response.json({
    message: "Address deleted successfully",
    status: 200,
    success: true,
  });
}
