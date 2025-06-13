// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// คุณสามารถประกาศ Type ของคุณที่นี่ หรือ import มาก็ได้
export type MyUser = {
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
        // ในสถานการณ์จริง คุณจะ fetch จาก API ของคุณ
        // const res = await fetch(...)
        // const data = await res.json()
        
        // นี่คือข้อมูลจำลอง
        if (
          credentials?.username === "admin" &&
          credentials?.password === "1234"
        ) {
          const user: MyUser = {
            id: "123",
            name: "John Doe",
            email: "john@example.com",
            token: "abc123xyz-from-api" // นี่คือ token ที่คุณได้จาก backend
          };
          return user;
        }

        // ถ้า login ไม่สำเร็จ ให้ return null
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // สำคัญมาก: ต้องเป็น jwt เพื่อให้ callbacks.jwt ทำงาน
  },
  callbacks: {
    // callback นี้จะถูกเรียกเมื่อ JWT ถูกสร้างหรืออัปเดต
    async jwt({ token, user }) {
      // `user` จะมีค่าเฉพาะตอน sign in ครั้งแรก
      // เราต้องส่งข้อมูลจาก `user` (ที่ได้จาก authorize) ไปยัง `token`
      if (user) {
        const myUser = user as MyUser; // Cast user เป็น type ที่เรากำหนด
        token.accessToken = myUser.token;
        token.id = myUser.id;
        token.name = myUser.name;
        token.email = myUser.email;
      }
      return token;
    },
    // callback นี้จะถูกเรียกเมื่อ client ขอ session
    async session({ session, token }) {
      // ส่งข้อมูลจาก `token` (ที่ได้จาก jwt callback) ไปยัง `session`
      // เพื่อให้ฝั่ง client สามารถเข้าถึงข้อมูลเหล่านี้ได้
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  // เพิ่ม secret เพื่อความปลอดภัย
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', // (Optional) หากคุณมีหน้า login ของตัวเอง
  }
};