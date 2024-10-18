import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";
import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProvider from "@/app/_components/SessionProvider";
import ReactQueryProvider from "@/app/_components/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Spedee",
  description: "Spedee",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={cn(
            `${geistSans.variable} ${geistMono.variable} antialiased`,
            "min-h-svh"
          )}
        >
          <ReactQueryProvider>
            <Navbar />
            <div className="mx-auto max-w-screen-xl p-2 md:p-4">{children}</div>
            <Footer />
            <Toaster />
          </ReactQueryProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
