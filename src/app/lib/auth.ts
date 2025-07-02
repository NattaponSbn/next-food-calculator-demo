import type { NextAuthOptions, User } from "next-auth"; // 👈 ใช้ User จาก next-auth โดยตรง
import CredentialsProvider from "next-auth/providers/credentials";
import serverApiClient from "../core/services/server-api-client";

// ❌ ไม่ต้องประกาศ MyUser ที่นี่แล้ว เพราะเราขยาย Type ของ NextAuth โดยตรง

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // 👇 return type เป็น User ที่เราขยายแล้ว
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
        }

        try {
          // 1. เรียก API /auth เพื่อเอา Tokens
          const authResponse = await serverApiClient.post("/auth/login", {
            username: credentials.username,
            password: credentials.password,
          });

          const tokens = authResponse.data;

          if (tokens && tokens.accessToken) {
            // 2. ถ้าได้ token มา ให้ return object ที่มีแค่ token
            //    เราจะดึงข้อมูล user ทีหลังใน jwt callback
            return {
              // ข้อมูลจาก API /auth
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              expiresIn: tokens.expiresIn,
              kind: tokens.kind,

              // ข้อมูลที่ต้องมีตาม DefaultUser (ใส่ค่าชั่วคราว)
              id: "placeholder-id",
              name: "",
              email: "",
              image: "",
            };
          }
          return null;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // `user` object จะมีค่าแค่ตอนล็อกอินครั้งแรก
      if (user && account?.provider === "credentials") {
        // 1. นำข้อมูล token จาก `user` (ที่ได้จาก authorize) มาใส่ใน `token`
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;

        // ✨ 2. ใช้ accessToken ไปเรียก API ดึงข้อมูลผู้ใช้ ✨
        try {
          const profileResponse = await serverApiClient.get('/user/profile',
            {   // options จะเป็น parameter ที่สามสำหรับ .post()
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            });

          const userProfile = profileResponse.data;

          // 3. ผนวกข้อมูล profile เข้าไปใน token (ปรับตาม API ที่มี)

          // ถ้า API ไม่มี id, เราอาจจะต้องใช้ข้อมูลอื่นแทน หรือรอ API อัปเดต
          // ในที่นี้จะลองใช้ userName เป็น id ชั่วคราว
          token.id = userProfile.userName || token.id; // ใช้ userName หรือ id เดิม (placeholder)

          token.name = userProfile.displayName;

          // ถ้า API ไม่มี email, เราอาจจะใช้ userName เป็น email ชั่วคราว
          token.email = userProfile.userName || null; // หรือใส่ null ไปเลยถ้าไม่จำเป็น
          // token.roles = userProfile.roles; // หรือข้อมูลอื่นๆ ที่ต้องการ
        } catch (error) {
          console.error("Failed to fetch user profile in JWT callback", error);
          // อาจจะคืนค่า token เดิม หรือจัดการ error ตามต้องการ
          // การคืนค่า token ที่มีแค่ access token ก็ยังทำให้ผู้ใช้ล็อกอินได้
          // แต่อาจจะไม่มีข้อมูลชื่อ/อีเมล
          return { ...token, error: "FetchProfileError" };
        }
      }

      // สำหรับการเรียกครั้งต่อๆ ไป จะคืนค่า token ที่มีข้อมูลครบถ้วนแล้ว
      return token;
    },

    async session({ session, token }) {
      // `token` คือข้อมูลล่าสุดจาก `jwt` callback
      // เราจะส่งข้อมูลจาก token ไปยัง session
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        // session.user.roles = token.roles;

        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        // สามารถเพิ่ม error handling ได้
        // session.error = token.error
      }
      return session;
    },
  },
   events: {
    async signOut({ token, session }) {
      // `token` คือ JWT ที่มีข้อมูลทั้งหมด รวมถึง accessToken และ refreshToken
      console.log("SignOut event triggered. Invalidating token on backend...");

      try {
        // เรียก API /auth/logout ของคุณจากฝั่ง Server
        // ส่ง refreshToken ไปด้วยถ้า Backend ต้องการ
        await serverApiClient.post('/auth/logout', {
          refreshToken: token.refreshToken,
        }, {
          headers: {
            // ส่ง accessToken ไปด้วยถ้าจำเป็น
            Authorization: `Bearer ${token.accessToken}`,
          }
        });

        console.log("✅ Token successfully invalidated on backend.");
      } catch (error) {
        console.error("💥 Failed to invalidate token on backend.", error);
        // เราอาจจะแค่ log error ไว้ เพราะยังไงฝั่ง client ก็จะ logout อยู่ดี
      }
    }
  },

  pages: {
    signIn: "/login", // หน้าล็อกอินของคุณ
  },
  secret: process.env.NEXTAUTH_SECRET,
};
