import * as z from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, { message: "กรุณากรอกชื่อผู้ใช้" }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
  // isRemember: z.boolean().optional(), // ถ้าจะใช้ checkbox ให้เปิดคอมเมนต์
});

export type LoginFormValues = z.infer<typeof loginSchema>;