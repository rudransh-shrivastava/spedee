import nodemailer from "nodemailer";
export async function GET() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "@gmail.com",
      pass: "",
    },
  });
  async function sendOrderEmail() {
    const mailOptions = {
      from: "@gmail.com",
      to: "@gmail.com",
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
  sendOrderEmail();
  return new Response("Hello World");
}
