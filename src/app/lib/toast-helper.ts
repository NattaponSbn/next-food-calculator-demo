import toast from 'react-hot-toast';

// กำหนด Interface สำหรับข้อความที่จะแสดงผล
interface ToastMessages<T> {
  loading: string;
  success: string | ((data: T) => string); // ข้อความสำเร็จอาจเป็น string หรือ function ก็ได้
  error: string | ((err: any) => string); // ข้อความ error อาจเป็น string หรือ function ก็ได้
}

/**
 * ฟังก์ชันกลางสำหรับจัดการ Promise ด้วย react-hot-toast
 * @param promise - Promise ที่ต้องการจะจัดการ
 * @param messages - Object ที่มีข้อความสำหรับสถานะ loading, success, และ error
 */
export const handleToastPromise = <T>(
  promise: Promise<T>,
  messages: ToastMessages<T>
): Promise<T> => {
  
  // สร้าง Toast ID เริ่มต้นสำหรับสถานะ loading
  const toastId = toast.loading(messages.loading);

  return promise
    .then((data) => {
      // เมื่อ Promise สำเร็จ (resolve)
      const successMessage = typeof messages.success === 'function' 
        ? messages.success(data) 
        : messages.success;
      
      toast.success(successMessage, { id: toastId });
      return data; // ส่งข้อมูลที่ได้จาก promise กลับไปให้ caller
    })
    .catch((err) => {
      // เมื่อ Promise ล้มเหลว (reject)
      const errorMessage = typeof messages.error === 'function'
        ? messages.error(err)
        : messages.error;

      toast.error(errorMessage, { id: toastId });
      throw err; // โยน error ต่อเพื่อให้ caller สามารถจัดการเพิ่มเติมได้
    });
};