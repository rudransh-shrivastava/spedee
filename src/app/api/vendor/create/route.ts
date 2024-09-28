import { connectDB } from "@/lib/mongodb";
// import { NextRequest } from "next/server";
// import Vendor from "@/models/Vendor";
// import { VendorType } from "@/models/Vendor";
// request: NextRequest
export default async function POST() {
  await connectDB();

  // const searchParams = request.nextUrl.searchParams;
  // const name = searchParams.get("name");
  // const location = searchParams.get("location");
  // const phoneNo = searchParams.get("phoneNo");
  // const address = searchParams.get("address");
  // const isOpen = searchParams.get("isOpen");
  // const openDays = searchParams.getAll("openDays");
  // const openTime = searchParams.getAll("openTime");

  // const newVendor: VendorType = {
  //   name: name || "",
  //   location: location || "",
  //   phoneNo: phoneNo || "",
  //   address: address || "",
  //   isOpen: isOpen,
  //   openDays: openDays,
  //   openTime: openTime,
  // };
}
