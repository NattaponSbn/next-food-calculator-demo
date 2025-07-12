// src/types/axios.d.ts
import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * ถ้าตั้งเป็น false, Global Loading Spinner จะไม่แสดงสำหรับ Request นี้
     * @default true
     */
    showLoading?: boolean;
  }
}