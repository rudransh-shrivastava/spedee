import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  console.log("data received: ", data);
  // return Response.json({ message: "Payment successful" });
  const decodedResponse = Buffer.from(data.response, "base64").toString(
    "utf-8"
  );
  const parsedResponse = JSON.parse(decodedResponse);
  console.log("Decoded response: ", parsedResponse);

  const { transactionId, state } = parsedResponse.data;
  const secretKey = "96434309-7796-489d-8924-ab56988a6076";
  const checksum = req.headers.get("x-verify") || "";
  const saltIndex = "1";
  const isValid = verifyChecksum(
    parsedResponse,
    checksum,
    secretKey,
    saltIndex
  );

  if (!isValid) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
  }

  if (state === "COMPLETED") {
    await updatePurchaseStatus(transactionId, "completed");
    return NextResponse.json({ message: "Payment successful" });
  } else {
    await updatePurchaseStatus(transactionId, "failed");
    return NextResponse.json({ message: "Payment failed" }, { status: 400 });
  }
}

async function updatePurchaseStatus(transactionId: string, status: string) {
  await Order.updateOne({ transactionId }, { status });
}

// chatgpt wrote this code dont trust it
function verifyChecksum(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any,
  checksum: string,
  secretKey: string,
  saltIndex: string
): boolean {
  const payloadString = JSON.stringify(response.data);
  const base64Payload = Buffer.from(payloadString).toString("base64");
  console.log("base64", base64Payload);
  console.log("salt key:", secretKey);
  console.log("salt index:", saltIndex);
  const endpoint = "/pg/v1/pay"; // Ensure this matches the endpoint used in the request
  const checksumString = base64Payload + endpoint + secretKey;
  const hash = crypto.createHash("sha256").update(checksumString).digest("hex");
  console.log("sha256hash", hash);
  const expectedChecksum = `${hash}###${saltIndex}`;
  console.log(expectedChecksum, checksum);

  // Convert both strings to buffers for timingSafeEqual
  const expectedChecksumBuffer = Buffer.from(expectedChecksum);
  const checksumBuffer = Buffer.from(checksum);

  // Ensure both buffers are of the same length
  if (expectedChecksumBuffer.length !== checksumBuffer.length) {
    return false;
  }
  const result = crypto.timingSafeEqual(expectedChecksumBuffer, checksumBuffer);
  console.log(result);
  // Use timingSafeEqual to compare the buffers
  return result;
}
