// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login", // 👈 หน้า login ที่ redirect ไป
  },
});

export const config = {
  matcher: [
    "/main/:path*",  // 👈 เฉพาะ path ที่ต้องการป้องกัน
    "/dashboard/:path*",
  ],
};
