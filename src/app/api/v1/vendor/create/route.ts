import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

import Vendor, { VendorZodSchema } from "@/models/Vendor";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const vendor = VendorZodSchema.safeParse(data);

  if (!vendor.success) {
    return Response.json({ message: vendor.error });
  }

  if (await Vendor.findOne({ email: vendor.data.email })) {
    return Response.json({ message: "Vendor already exists" });
  }

  await Vendor.create(vendor.data);
  await User.findOneAndUpdate({ email: vendor.data.email }, { role: "vendor" });

  return Response.json({ message: "Vendor created successfully" });
}
