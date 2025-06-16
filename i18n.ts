import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import ไฟล์ภาษาของเรา
import translationEN from './public/locales/en.json';
import translationTH from './public/locales/th.json';

i18n
  // ตรวจจับภาษาของผู้ใช้ (จาก cookie, localstorage, etc.)
  .use(LanguageDetector)
  // ส่ง instance i18n ไปให้ react-i18next
  .use(initReactI18next)
  // ตั้งค่า i18next
  .init({
    debug: process.env.NODE_ENV === 'development', // แสดง log ตอน dev
    fallbackLng: 'th', // ภาษาเริ่มต้นถ้าหาภาษาที่ต้องการไม่เจอ
    interpolation: {
      escapeValue: false, // React ป้องกัน XSS อยู่แล้ว
    },
    // ทรัพยากรภาษาทั้งหมด
    resources: {
      en: {
        translation: translationEN,
      },
      th: {
        translation: translationTH,
      },
    },
    // ตั้งค่าสำหรับ LanguageDetector
    detection: {
      // ลำดับการตรวจจับภาษา
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      // key ที่จะใช้เก็บใน cookie
      caches: ['cookie'], 
    }
  });

export default i18n;