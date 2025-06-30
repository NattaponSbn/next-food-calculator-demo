import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// ขยาย JWT Type ที่มีอยู่แล้ว
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    name?: string | null; // เพิ่ม name, email
    email?: string | null;
    accessToken: string;
    refreshToken: string;
    error?: string;
  }
}

// ขยาย Session Type ที่มีอยู่แล้ว
declare module "next-auth" {
  interface User extends DefaultUser {
    // เพิ่ม property ที่ได้จาก API ของคุณ
    id: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    kind: string;
  }

  interface Session {
    // เพิ่ม property ที่ต้องการให้ฝั่ง Client เข้าถึงได้
    user: {
      id: string;
    } & DefaultSession["user"]; // คง type เริ่มต้นของ user ไว้
    
    accessToken: string;
    refreshToken: string;
  }
}