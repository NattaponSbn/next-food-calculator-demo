// types/next-auth.d.ts

import "next-auth";
import "next-auth/jwt";

// ขยาย Type ของ User ที่มาจาก NextAuth
declare module "next-auth" {
  interface User {
    // เพิ่ม property ที่คุณต้องการ
    id: string;
    token: string;
    // name และ email มีอยู่แล้ว ไม่ต้องเพิ่ม
  }

  interface Session {
    // เพิ่ม property ที่คุณจะส่งไปให้ session
    accessToken: string;
    // ขยาย user ใน session ให้มี type ของเรา
    user: {
      id: string;
    } & DefaultSession["user"]; // เอา type เดิมของ user มาด้วย
  }
}

// ขยาย Type ของ JWT
declare module "next-auth/jwt" {
  interface JWT {
    // เพิ่ม property ที่เราเก็บใน token
    accessToken: string;
    id: string;
  }
}