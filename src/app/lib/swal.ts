import Swal, { SweetAlertResult } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// สร้าง Instance ของ Swal ที่สามารถ render React component ได้
const MySwal = withReactContent(Swal);

// --- ฟังก์ชันกลางสำหรับ Confirmation ทั่วไป ---
interface ConfirmOptions {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
}

/**
 * ฟังก์ชันกลางสำหรับแสดง Modal ยืนยัน
 * @param {ConfirmOptions} options - ตัวเลือกสำหรับปรับแต่งข้อความและไอคอน
 * @returns {Promise<SweetAlertResult>} - Promise ที่จะ resolve เมื่อผู้ใช้เลือก
 */
export const showConfirmation = (options: ConfirmOptions = {}): Promise<SweetAlertResult> => {
  const {
    title = 'คุณแน่ใจหรือไม่?', // ค่าเริ่มต้น
    text = "การกระทำนี้อาจไม่สามารถย้อนกลับได้!", // ค่าเริ่มต้น
    confirmButtonText = 'ยืนยัน', // ค่าเริ่มต้น
    cancelButtonText = 'ยกเลิก', // ค่าเริ่มต้น
    icon = 'warning', // ค่าเริ่มต้น
  } = options;

  return MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText,
    cancelButtonText,
  });
};


// --- ฟังก์ชันกลางสำหรับกรณีเฉพาะ เช่น "ยืนยันการลบ" ---
/**
 * ฟังก์ชันสำหรับแสดง Modal ยืนยันการลบโดยเฉพาะ
 * @param {string} itemName - ชื่อของสิ่งที่กำลังจะถูกลบ (เช่น 'ผู้ใช้ John Doe')
 * @returns {Promise<SweetAlertResult>}
 */
export const showDeleteConfirm = (itemName: string = 'ข้อมูลนี้'): Promise<SweetAlertResult> => {
  return showConfirmation({
    title: 'ยืนยันการลบ',
    text: `คุณต้องการลบ "${itemName}" จริงๆ ใช่ไหม?`,
    confirmButtonText: 'ใช่, ลบเลย',
    icon: 'warning',
  });
};


// --- ฟังก์ชันกลางสำหรับกรณี "ออกจากระบบ" ---
/**
 * ฟังก์ชันสำหรับแสดง Modal ยืนยันการออกจากระบบ
 * @returns {Promise<SweetAlertResult>}
 */
export const showLogoutConfirm = (): Promise<SweetAlertResult> => {
    return showConfirmation({
        title: 'ยืนยันการออกจากระบบ',
        text: 'คุณต้องการที่จะออกจากระบบใช่ไหม?',
        confirmButtonText: 'ใช่, ออกจากระบบ',
        icon: 'question'
    });
};


// Export ตัว Swal หลักไปด้วย เผื่อต้องการใช้งานแบบ custom เต็มรูปแบบ
export default MySwal;