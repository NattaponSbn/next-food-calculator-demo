/**
 * จัดรูปแบบตัวเลขโดยการใส่จุลภาค (comma) และกำหนดจำนวนทศนิยม
 *
 * @param value - ค่าที่ต้องการจัดรูปแบบ (สามารถเป็น string หรือ number)
 * @param options - (Optional) ตัวเลือกเพิ่มเติมสำหรับการจัดรูปแบบ
 * @param options.minimumFractionDigits - จำนวนทศนิยมขั้นต่ำ (default: 2)
 * @param options.maximumFractionDigits - จำนวนทศนิยมสูงสุด (default: 2)
 * @returns {string} - ตัวเลขที่จัดรูปแบบแล้ว หรือค่าเดิมถ้าไม่สามารถแปลงเป็นตัวเลขได้
 */
export const formatNumberWithCommas = (
  value: string | number | null | undefined,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string => {
  // 1. คืนค่าเป็น string ว่าง หรือ '-' ถ้าค่าเริ่มต้นไม่มี
  if (value === null || value === undefined) {
    return '-'; // หรือ '' ตามที่คุณต้องการ
  }

  // 2. แปลงค่าเป็นตัวเลข
  const num = Number(value);

  // 3. ตรวจสอบว่าเป็นตัวเลขที่ถูกต้องหรือไม่
  if (isNaN(num)) {
    return String(value); // ถ้าไม่ใช่ตัวเลข (เช่น 'tr') ให้คืนค่าเดิม
  }

  // 4. ใช้ toLocaleString() ซึ่งเป็นวิธีมาตรฐานในการจัดรูปแบบ
   return num.toLocaleString('en-US', {
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    // ...options // การใส่ ...options ตรงนี้อาจจะไม่จำเป็นถ้าคุณไม่ได้ต้องการส่ง options อื่นๆ ของ toLocaleString
  });
};

/**
 * ตัวอย่างฟังก์ชันอื่นๆ ที่อาจจะมีในอนาคต
 */
export const formatAsCurrency = (value: number): string => {
  return value.toLocaleString('th-TH', { style: 'currency', currency: 'THB' });
};