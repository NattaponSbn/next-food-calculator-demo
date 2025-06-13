"use client";

import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  // เราสามารถเพิ่ม Logic หรือข้อมูลที่แปลงแล้วเข้าไปได้ตรงนี้เลย
  return {
    user: session?.user, // ส่งคืนเฉพาะ object user เพื่อความสะดวก
    status, // ส่ง status ไปด้วย
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
};