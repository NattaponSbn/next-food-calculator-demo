'use client';

import { TextInput } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { MasterRawSelectedIngredientModel } from '@/app/core/models/master/raw-material/raw-material.model';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/app/core/hooks/use-debounce';

interface IngredientRowProps {
  ingredient: MasterRawSelectedIngredientModel;
  isViewMode: boolean;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export const IngredientRow = ({ ingredient, isViewMode, onUpdateQuantity, onRemove }: IngredientRowProps) => {
  const [displayValue, setDisplayValue] = useState<string>(String(ingredient.quantity));
  const debouncedDisplayValue = useDebounce(displayValue, 800); // หน่วงเวลา 800ms

   useEffect(() => {
    // อัปเดตเฉพาะเมื่อค่าไม่ตรงกัน เพื่อป้องกันการเขียนทับขณะผู้ใช้กำลังพิมพ์
    if (parseFloat(displayValue) !== ingredient.quantity) {
      setDisplayValue(String(ingredient.quantity));
    }
  }, [ingredient.quantity]);

  // 4. useEffect ตัวที่สอง: สำหรับ "ส่งค่ากลับ" เมื่อผู้ใช้หยุดพิมพ์
  useEffect(() => {
    // แปลงค่าที่ debounce แล้วเป็นตัวเลข
    const numericValue = parseFloat(debouncedDisplayValue);

    // ทำงานก็ต่อเมื่อ:
    // a. ค่าที่ debounce แล้วไม่ใช่ค่าว่าง
    // b. และสามารถแปลงเป็นตัวเลขได้
    // c. และค่าตัวเลขนั้นไม่เท่ากับค่าเดิมใน state หลัก
    if (debouncedDisplayValue !== '' && !isNaN(numericValue) && numericValue !== ingredient.quantity) {
      console.log(`Debounced: Calling onUpdateQuantity for item ${ingredient.id} with value ${numericValue}`);
      onUpdateQuantity(ingredient.id, numericValue);
    }
  }, [debouncedDisplayValue]); // <-- Dependency คือค่าที่ถูก debounce แล้ว

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // แค่อัปเดต UI ทันที
    setDisplayValue(e.target.value);
  };
  
  // เราอาจจะไม่ต้องใช้ onBlur แล้ว หรือเก็บไว้เป็น fallback ก็ได้
  const handleBlur = () => {
    // ถ้าผู้ใช้ลบจนว่างแล้วคลิกออก ให้เด้งค่ากลับเป็นค่าเดิม
    if (displayValue === '') {
        setDisplayValue(String(ingredient.quantity));
    }
  }
  return (
    <div className="flex items-center gap-3 p-2 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <span className="flex-grow font-medium text-gray-900 dark:text-white">{ingredient.data.name}</span>
      <div className="w-24 flex-shrink-0">
        <TextInput type="text" inputMode="decimal" className="form-control form-rounded-xl" value={displayValue}  onChange={handleChange} onBlur={handleBlur} sizing="sm" min="0" disabled={isViewMode} />
      </div>
      <span className="w-10 text-gray-600 dark:text-gray-400 flex-shrink-0">{ingredient.unit}</span>
      { !isViewMode && (
        <button onClick={() => onRemove(ingredient.id)} className="text-red-500 hover:text-red-700 flex-shrink-0">
                <Icon icon="mdi:close-circle-outline" width="24" />
        </button>
      ) }
     
    </div>
  );
};