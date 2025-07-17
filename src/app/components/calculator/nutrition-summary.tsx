'use client';

import { CalculatedNutrientGroupModel, NutritionSummaryResponse } from '@/app/core/models/calculator/calculator.mode';
import { formatNumberWithCommas } from '@/app/lib/number-helpers';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Import Type ของ Response เข้ามา

interface NutritionSummaryProps {
  summary: NutritionSummaryResponse | null;
  isLoading: boolean;
}

/**
 * Component ย่อยสำหรับแสดงผลสารอาหารแต่ละรายการ
 */
const NutrientItem = ({ name, value, unit }: { name: string, value: string, unit: string }) => (
  <div className="flex justify-between items-baseline">
    <span className="text-gray-600 dark:text-gray-400">{name}:</span>
    <span className="font-medium text-gray-900 dark:text-gray-200">
       {formatNumberWithCommas(value)} <span className="text-xs text-gray-500">{unit}</span>
    </span>
  </div>
);

interface NutrientGroupProps {
  group: CalculatedNutrientGroupModel;
  isOpen: boolean;
  onToggle: () => void;
}

const NutrientGroup = ({ group, isOpen, onToggle }: NutrientGroupProps) => {
  // ... (Logic การแบ่งคอลัมน์เหมือนเดิม)
  const midpoint = Math.ceil(group.nutrients.length / 2);
  const leftColumnNutrients = group.nutrients.slice(0, midpoint);
  const rightColumnNutrients = group.nutrients.slice(midpoint);

  return (
    // ✅ 1. ใช้ div หลักที่มีเส้นขอบล่าง
    <div key={group.groupId} className="border-b dark:border-gray-700 last:border-b-0">
      
      {/* ✅ 2. สร้าง Header ที่เป็นปุ่มกดได้ */}
      <button 
        onClick={onToggle}
        className="w-full flex justify-between items-center py-4 text-left"
      >
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
          {group.groupName}
        </h3>
        {/* ไอคอนลูกศรจะหมุนตามสถานะ isOpen */}
        <Icon 
          icon="solar:alt-arrow-down-bold" 
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {/* ✅ 3. สร้าง Content Area ที่จะแสดง/ซ่อน */}
      <div
        className={`
          grid grid-cols-1 md:grid-cols-2 gap-x-8 text-sm
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-96 py-4' : 'max-h-0'}
        `}
        // ใช้ max-h เพื่อสร้าง animation การสไลด์ลง
        // max-h-96 คือความสูงสูงสุดโดยประมาณ (ปรับได้)
      >
         <div className="space-y-1">
          {leftColumnNutrients.map(nutrient => (
            // ✅ [แก้ไข] ส่ง props โดยระบุชื่อให้ถูกต้อง
            <NutrientItem 
              key={nutrient.nutritionId}
              name={nutrient.nutritionName} // <-- จับคู่ nutritionName -> name
              value={nutrient.value}
              unit={nutrient.unitName}     // <-- จับคู่ unitName -> unit
            />
          ))}
        </div>
         <div className="space-y-1">
          {rightColumnNutrients.map(nutrient => (
            // ✅ [แก้ไข] ทำเหมือนกันที่นี่
            <NutrientItem 
              key={nutrient.nutritionId}
              name={nutrient.nutritionName}
              value={nutrient.value}
              unit={nutrient.unitName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const NutritionSummary = ({ summary, isLoading }: NutritionSummaryProps) => {
  const { t } = useTranslation();
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  // --- [เพิ่ม] Handler สำหรับสลับการเปิด/ปิด ---
  const toggleGroup = (groupId: number) => {
    setOpenGroups(prev => ({
      ...prev, // คงสถานะของกลุ่มอื่นๆ ไว้
      [groupId]: !prev[groupId] // สลับค่า true/false ของกลุ่มที่ถูกคลิก
    }));
  };

   // --- useEffect เพื่อเปิดทุกกลุ่มเป็น default เมื่อข้อมูล summary เปลี่ยน ---
  useEffect(() => {
    if (summary) {
      const initialOpenState = summary.reduce((acc, group) => {
        acc[group.groupId] = true; // เปิดทุกกลุ่มเป็นค่าเริ่มต้น
        return acc;
      }, {} as Record<number, boolean>);
      setOpenGroups(initialOpenState);
    }
  }, [summary]); // ทำงานเมื่อ summary เปลี่ยน

  if (isLoading) {
    return (
      <div className="panel flex items-center justify-center h-full min-h-[300px]">
        <Spinner size="xl" />
        <span className="ml-3 text-gray-500">{t('calculator.calculating')}...</span>
      </div>
    );
  }

  if (!summary || summary.length === 0) {
    return (
      <div className="panel flex items-center justify-center h-full min-h-[300px]">
        <p className="text-gray-500">{t('calculator.noSummary')}</p>
      </div>
    );
  }
  
  return (
    <div className="panel flex flex-col h-full"> 
      
      <div className="panel-header flex-shrink-0"> {/* 2. Header ไม่ยืด/หด */}
        <h2 className="panel-title">{t('calculator.nutritionSummaryTitle')}</h2>
      </div>
      
      {/* ✅ 3. Panel Body จะยืดและ scroll ได้ */}
      <div className="panel-body flex-grow overflow-y-auto max-h-[40vh]">
        {summary.map(group => (
          <NutrientGroup 
          key={group.groupId} 
          group={group}
          isOpen={!!openGroups[group.groupId]} 
          onToggle={() => toggleGroup(group.groupId)} 
             />
        ))}
      </div>
    </div>
  );
};