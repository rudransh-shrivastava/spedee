import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import { connectDB } from "./mongodb";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn(data: any) {
      console.log(data);
      const account = data.account;
      const profile = data.profile;
      await connectDB();
      if (account.provider === "google") {
        const user = await User.findOne({ email: profile.email });
        if (!user) {
          await User.create({
            email: profile.email,
            name: profile.name,
            role: "customer",
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = dbUser?.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as string;
      return session;
    },
  },
};
