// lib/apiClient.ts

import axios from 'axios';
import { useUIStore } from '../store/ui-store';

// สร้าง Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-default-api.com/api', // URL หลักของ API ของคุณ
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // กำหนด timeout 10 วินาที
});

// --- Interceptors: หัวใจของการทำงานแบบ "เต็มระบบ" ---

// 1. Request Interceptor: ทำงานก่อนที่ request จะถูกส่งออกไป
apiClient.interceptors.request.use(
  (config) => {
    // โค้ดที่ต้องทำทุกครั้งก่อนส่ง request
    useUIStore.getState().showLoading(); // เปิด Loading
    
    // ตัวอย่าง: การดึง Token จาก Local Storage หรือ Cookie แล้วใส่ใน Header
    const token = localStorage.getItem('accessToken'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // (เสริม) อาจจะเปิด global loading state ที่นี่
    // store.dispatch(showLoading());

    return config;
  },
  (error) => {
    // จัดการกับ error ที่เกิดขึ้นก่อนการส่ง request
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: ทำงานหลังจากได้รับ response กลับมา
apiClient.interceptors.response.use(
  (response) => {
    // โค้ดที่ต้องทำเมื่อได้รับ response ที่สำเร็จ (status 2xx)
    useUIStore.getState().hideLoading(); // ปิด Loading
    // (เสริม) อาจจะปิด global loading state ที่นี่
    // store.dispatch(hideLoading());
    
    // โดยปกติเราจะสนใจเฉพาะส่วน data ของ response
    return response.data; 
  },
  (error) => {
    // โค้ดที่ต้องทำเมื่อได้รับ response ที่เป็น error (status 3xx, 4xx, 5xx)
    useUIStore.getState().hideLoading(); // ปิด Loading
    // (เสริม) ปิด global loading state
    // store.dispatch(hideLoading());

    if (axios.isAxiosError(error) && error.response) {
      // Server ตอบกลับมาพร้อม status code ที่ไม่ใช่ 2xx
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized: อาจจะหมายถึง Token หมดอายุ
          // ทำการ redirect ไปหน้า login หรือเรียก API เพื่อ refresh token
          console.error('Unauthorized, redirecting to login...');
          // window.location.href = '/login';
          break;

        case 403:
          // Forbidden: ไม่มีสิทธิ์เข้าถึงข้อมูล
          console.error('Forbidden access.');
          // แสดงข้อความแจ้งเตือน
          break;

        case 404:
          // Not Found
          console.error('Resource not found.');
          break;
        
        case 500:
          // Internal Server Error
          console.error('Internal Server Error.');
          break;

        default:
          // จัดการ error อื่นๆ
          console.error(`Error ${status}:`, data);
          break;
      }
    } else {
      // จัดการกับ error ที่ไม่ได้มาจาก server (เช่น network error)
      console.error('Network or other error:', error.message);
    }
    
    // ส่งต่อ error เพื่อให้ .catch() ที่เรียกใช้ API สามารถจัดการต่อได้
    return Promise.reject(error);
  }
);

export default apiClient;