// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";

type MyUser = {
  id: string;
  name: string;
  email: string;
  token: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<MyUser | null> {
        // const res = await fetch("https://your-api.com/login", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     username: credentials?.username,
        //     password: credentials?.password,
        //   }),
        // });
        const user: MyUser = {
          id: "123",
          name: "John Doe",
          email: "john@example.com",
          token: "abc123xyz"
        };

        // if (user) {
        //   return user;
        // }
        // จำลองตรวจสอบ username/password
        if (
          credentials?.username === "admin" &&
          credentials?.password === "1234"
        ) {
          return user;
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;  // <--- Fix here
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: NextAuthJWT }) {
      session.accessToken = token.accessToken;
      session.user.name = token.name;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
