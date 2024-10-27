import nodemailer from "nodemailer";
export async function GET() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {},
  });
  async function sendOrderEmail() {
    const mailOptions = {
      subject: "Order Confirmation",
      text: `Thank you for your order, ! Your order details: $}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Order email sent successfully");
    } catch (error) {
      console.error("Error sending order email:", error);
    }
  }
  return new Response("Hello World");
}
