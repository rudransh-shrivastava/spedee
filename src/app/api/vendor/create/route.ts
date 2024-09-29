import { connectDB } from "@/lib/mongodb";

import Vendor, { VendorZodSchema } from "@/models/Vendor";
// TODO: protect route, only allow "admin" to create vendor
export async function POST(req: Request) {
  await connectDB();

  const data = await req.json();
  const vendor = VendorZodSchema.safeParse(data);

  if (!vendor.success) {
    return Response.json({ message: vendor.error });
  }

  await Vendor.create(vendor.data);

  return Response.json({ message: "Vendor created successfully" });
}
