import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { paymentGateway } from "@/lib/phonepe";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";

export async function POST() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userEmail = session.user.email;
  const amount = 500;
  const transactionId = `TR${Date.now()}`;
  const userId = session.user.email ?? "anonymous";
  const shippingAddress = {
    address: "123, Main Street",
    city: "Bangalore",
    state: "Karnataka",
    zip: "473005",
  };
  await Order.create({
    transactionId,
    amount,
    status: "pending",
    products: [], // TODO: Add products
    userEmail,
    shippingAddress,
    paymentMethod: "phonepe",
  });
  const resp = await paymentGateway.initPayment({
    amount,
    transactionId,
    userId,
    redirectUrl: "http://localhost:3000/payredirect",
    callbackUrl: "http://localhost:3000/api/v1/payment-callback",
    // TODO: add a secret key to verify transacitons on callback
  });
  console.log(resp);
  console.log(resp.data.instrumentResponse);
  return Response.json({ message: "Payment initiated", success: true });
}
// TODO: use ngrock and update callbackurl
