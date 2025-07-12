// lib/apiClient.ts

import axios from 'axios';
import { useUIStore } from '../store/ui-store';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';

// สร้าง Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // URL หลักของ API ของคุณ
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // กำหนด timeout 10 วินาที
});

// --- Interceptors: หัวใจของการทำงานแบบ "เต็มระบบ" ---

// 1. Request Interceptor: ทำงานก่อนที่ request จะถูกส่งออกไป
apiClient.interceptors.request.use(
  async (config) => {
    // โค้ดที่ต้องทำทุกครั้งก่อนส่ง request
   if (config.showLoading !== false) {
      useUIStore.getState().showLoading();
    }
    // (เสริม) อาจจะเปิด global loading state ที่นี่
    // store.dispatch(showLoading());
    const session = await getSession(); 

    if (session?.accessToken) {
      // ถ้ามี session และ accessToken, ให้ใส่ Header
      console.log("[apiClient] Session found, attaching token to header.");
      config.headers['Authorization'] = `Bearer ${session.accessToken}`;
    } else {
      console.warn("[apiClient] No session found. Request sent without token.");
    }
    return config;
  },
  (error) => {
    // จัดการกับ error ที่เกิดขึ้นก่อนการส่ง request
    useUIStore.getState().hideLoading();
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: ทำงานหลังจากได้รับ response กลับมา
apiClient.interceptors.response.use(
  (response) => {
    if (response.config.showLoading !== false) {
      useUIStore.getState().hideLoading();
    }
    return response; 
  },
  (error) => {
    if (error.config?.showLoading !== false) {
      useUIStore.getState().hideLoading();
    }

    let errorMessage = 'An unexpected error occurred.';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server ตอบกลับมา
        const { status, data } = error.response;
        const serverMessage = data?.message || data?.title || error.message;

        switch (status) {
          case 401:
            errorMessage = 'Session expired. Please log in again.';
            // อาจจะเพิ่ม logic redirect ที่นี่
            // window.location.href = '/login';
            break;
          case 403:
            errorMessage = 'Access Denied: You do not have permission.';
            break;
          case 404:
            errorMessage = `Not Found: ${serverMessage}`;
            break;
          case 400: // Bad Request (มักจะมาจาก Validation)
            // ถ้า Backend ส่งรายละเอียด validation error มา
            if (data?.errors) {
              // แสดง error แรกที่เจอ
              const firstErrorKey = Object.keys(data.errors)[0];
              errorMessage = data.errors[firstErrorKey][0];
            } else {
              errorMessage = serverMessage;
            }
            break;
          default:
            errorMessage = serverMessage;
            break;
        }
      } else if (error.request) {
        // Request ถูกส่งไปแต่ไม่ได้รับการตอบกลับ (เช่น network error)
        errorMessage = 'Network error. Please check your connection.';
      }
    }
    
    toast.error(errorMessage); // แสดง Toast แจ้งเตือน
    
    return Promise.resolve(null);
  }
);

export default apiClient;