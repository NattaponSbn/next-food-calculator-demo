// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      id?: string;
      // add other fields here if needed
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    token: string; // your custom token
  }

  interface JWT {
    accessToken?: string;
    name?: string;
  }
}
