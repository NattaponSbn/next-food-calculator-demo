// MacroDistributionBar.tsx

import { CalculatedEnegyPercentModel } from '@/app/core/models/calculator/calculator.mode';
import React from 'react';

interface MacroDistributionBarProps {
  energyPercents: CalculatedEnegyPercentModel[];
  className?: string;
}

const MACRO_LIGHT_COLORS: { [key: number]: string } = {
  5: 'bg-pink-500',    // คาร์โบไฮเดรต
  3: 'bg-red-500',     // โปรตีน
  4: 'bg-yellow-500',  // ไขมัน
  6: 'bg-green-500',   // ใยอาหาร (ใช้สีเขียวเพื่อความชัดเจน)
};

const MACRO_DARK_COLORS: { [key: number]: string } = {
  5: 'dark:bg-pink-700',
  3: 'dark:bg-red-700',
  4: 'dark:bg-amber-600', // ใช้ Amber ใน Dark mode จะสบายตากว่า Yellow
  6: 'dark:bg-green-700',
};

// 3. กำหนดลำดับการแสดงผลที่ต้องการ เพื่อให้บาร์และ legend เรียงสวยงามเสมอ
const DISPLAY_ORDER = [5, 3, 4, 6]; // คาร์บ -> โปรตีน -> ไขมัน -> ใยอาหาร

const MacroDistributionBar: React.FC<MacroDistributionBarProps> = ({ energyPercents, className = '' }) => {

  // 4. กรองและจัดเรียงข้อมูลตามลำดับที่ต้องการ
  const sortedMacros = React.useMemo(() => {
    if (!energyPercents) return [];
    
    return energyPercents
      .filter(macro => DISPLAY_ORDER.includes(macro.id)) // กรองเอาเฉพาะอันที่ต้องการแสดง
      .sort((a, b) => DISPLAY_ORDER.indexOf(a.id) - DISPLAY_ORDER.indexOf(b.id)); // จัดเรียงตามลำดับ
  }, [energyPercents]);

  // ถ้าไม่มีข้อมูลที่ตรงเงื่อนไข ก็ไม่ต้องแสดงผลอะไรเลย
  if (sortedMacros.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
        {/* Container หลัก ใช้ gap เพื่อจัดการระยะห่าง */}
        <div className="flex w-full gap-2 md:gap-3">
            {sortedMacros.map(macro => {
                const numericValue = parseFloat(macro.value) || 0;
                
                // สร้าง class สีแบบไดนามิก
                const lightColor = MACRO_LIGHT_COLORS[macro.id] || 'bg-gray-500';
                const darkColor = MACRO_DARK_COLORS[macro.id] || 'dark:bg-gray-700';

                return (
                    // ✅ 3. ปรับปรุง Card ให้ Responsive, รองรับ Dark Mode เต็มรูปแบบ
                    <div
                        key={macro.id}
                        className={`
                            flex-1
                            flex flex-col items-center justify-center 
                            h-14 md:h-14
                            px-3 py-2
                            rounded-lg text-white
                            dark:border dark:border-gray-700/50
                            transition-all duration-300
                            ${lightColor} ${darkColor}
                        `}
                        title={`${macro.name}: ${numericValue.toFixed(2)}%`}
                    >
                        {/* ✅ 4. ปรับขนาด Font และการแสดงผลทศนิยม */}
                        <span className="text-xs md:text-sm font-medium opacity-90 text-center">{macro.name}</span>
                        <span className="text-sm md:text-sm lg:text-sm font-bold">
                            {numericValue.toFixed(1)}%
                        </span>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default MacroDistributionBar;