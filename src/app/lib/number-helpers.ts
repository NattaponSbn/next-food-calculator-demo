/**
 * จัดรูปแบบตัวเลขโดยการใส่จุลภาค (comma) และกำหนดลักษณะของทศนิยม
 *
 * @param value - ค่าที่ต้องการจัดรูปแบบ (สามารถเป็น string, number, null, หรือ undefined)
 * @param options - (Optional) ตัวเลือกเพิ่มเติมสำหรับการจัดรูปแบบ
 * @param options.decimalPlaces - กำหนดการแสดงผลทศนิยม
 *        - 'auto' (default): ไม่แสดงทศนิยมถ้าเป็นจำนวนเต็ม (เช่น 1,234), แสดงตามจริงถ้ามี (เช่น 1,234.56)
 *        - number: กำหนดจำนวนทศนิยมคงที่ (เช่น 2 จะได้ 1,234.00)
 * @param options.maximumFractionDigits - (ใช้เมื่อ decimalPlaces ไม่ใช่ 'auto') จำนวนทศนิยมสูงสุด
 * @returns {string} - ตัวเลขที่จัดรูปแบบแล้ว หรือ '-' ถ้าไม่มีค่า
 */
export const formatNumberWithCommas = (
  value: string | number | null | undefined,
  options?: {
    decimalPlaces?: 'auto' | number;
    maximumFractionDigits?: number;
  }
): string => {
  // 1. จัดการค่า null/undefined
  if (value === null || value === undefined) {
    return '-';
  }

  // 2. แปลงค่าเป็นตัวเลข
  const num = Number(value);

  // 3. ตรวจสอบว่าเป็นตัวเลขที่ถูกต้องหรือไม่
  if (isNaN(num)) {
    // ถ้าเป็น string ที่ไม่ใช่ตัวเลข เช่น 'N/A' ให้คืนค่าเดิม
    return String(value);
  }

  // 4. สร้าง object สำหรับ options ของ toLocaleString
  const localeOptions: Intl.NumberFormatOptions = {};

  const decimalPlaces = options?.decimalPlaces ?? 'auto'; // Default to 'auto'

  if (decimalPlaces === 'auto') {
    // กรณี 'auto': ไม่แสดง .00 ถ้าเป็นจำนวนเต็ม
    // toLocaleString ทำแบบนี้เป็น default อยู่แล้ว เราจึงไม่ต้องกำหนด minimum/maximum fraction digits
    // แต่เราอาจจะอยากจำกัดจำนวนทศนิยมสูงสุดถ้ามันยาวเกินไป
    if (options?.maximumFractionDigits !== undefined) {
      localeOptions.maximumFractionDigits = options.maximumFractionDigits;
    }
  } else {
    // กรณีที่ decimalPlaces เป็นตัวเลข: กำหนดทศนิยมคงที่
    localeOptions.minimumFractionDigits = decimalPlaces;
    localeOptions.maximumFractionDigits = options?.maximumFractionDigits ?? decimalPlaces;
  }

  // 5. จัดรูปแบบและคืนค่า
  return num.toLocaleString('en-US', localeOptions);
};

// --- กรณีที่ 1: เอาแค่คอมม่า ไม่เอา .00 (ค่า default ใหม่) ---
// console.log(formatNumberWithCommasDecimal(1234));         // ผลลัพธ์: "1,234"
// console.log(formatNumberWithCommasDecimal(1234.567));      // ผลลัพธ์: "1,234.567"
// console.log(formatNumberWithCommasDecimal(1234.5, { decimalPlaces: 'auto' })); // ผลลัพธ์: "1,234.5"

// --- กรณีที่ 2: จำกัดทศนิยมสูงสุดในโหมด 'auto' ---
// console.log(formatNumberWithCommasDecimal(1234.567, { decimalPlaces: 'auto', maximumFractionDigits: 2 })); // ผลลัพธ์: "1,234.57"

// --- กรณีที่ 3: ต้องการทศนิยม 2 ตำแหน่งเสมอ (เหมือนฟังก์ชันเดิม) ---
// console.log(formatNumberWithCommasDecimal(1234, { decimalPlaces: 2 })); // ผลลัพธ์: "1,234.00"
// console.log(formatNumberWithCommasDecimal(1234.5, { decimalPlaces: 2 })); // ผลลัพธ์: "1,234.50"

// --- กรณีที่ 4: ต้องการทศนิยม 0 ตำแหน่ง (ปัดเศษ) ---
// console.log(formatNumberWithCommasDecimal(1234.56, { decimalPlaces: 0 })); // ผลลัพธ์: "1,235"

// --- กรณีที่ 5: ค่าที่ไม่ถูกต้อง ---
// console.log(formatNumberWithCommasDecimal(null));       // ผลลัพธ์: "-"
// console.log(formatNumberWithCommasDecimal('abc'));      // ผลลัพธ์: "abc"