// lib/utils.ts
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * ฟังก์ชันแปลง HEX color code เป็นอาร์เรย์ของค่า RGB
 */
export function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
}