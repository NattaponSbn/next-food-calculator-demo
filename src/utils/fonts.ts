import { Niramit } from 'next/font/google';

// ตั้งค่าฟอนต์ Niramit
// - subsets: เลือกภาษาที่ต้องการใช้งาน (thai และ latin เป็นหลัก)
// - weight: เลือกน้ำหนักฟอนต์ที่ต้องการ (เช่น 400 คือ regular, 700 คือ bold)
// - variable: สร้าง CSS Variable เพื่อให้เรียกใช้งานได้ง่ายและยืดหยุ่น (แนะนำ)
// - display: 'swap' คือค่ามาตรฐานที่ดี
export const niramit = Niramit({
  subsets: ['thai', 'latin'],
  weight: ['400', '700'],
  variable: '--font-niramit', // ชื่อ CSS Variable ที่เราจะใช้
  display: 'swap',
});