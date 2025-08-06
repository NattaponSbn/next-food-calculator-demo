// components/BmrResultDisplay.tsx
import { CalculatorBMRResponseItemModel } from '@/app/core/models/calculator-bmr/bmr.model';
import { formatNumberWithCommas } from '@/app/lib/number-helpers';
import { hexToRgb } from '@/app/lib/utils';
import { Spinner } from 'flowbite-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface BmrResultDisplayProps {
  result: CalculatorBMRResponseItemModel | null;
  isLoading: boolean;
}

const BmrResultDisplay: React.FC<BmrResultDisplayProps> = ({ result, isLoading }) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="panel flex items-center justify-center h-full min-h-[300px]">
        <Spinner size="xl" />
        <span className="ml-3 text-gray-500">{t('calculator.calculating')}...</span>
      </div>
    );
  }

  return (
    <div className="panel h-full">
      <div className="panel-header">
        <h2 className="panel-title">พลังงานที่ต้องการในแต่ละวัน (TDEE)</h2>
      </div>
      <div className="panel-body">
        {result ? (
          <>
            <div className="text-center bg-gray-100 dark:bg-gray-700/50 px-6 py-3 rounded-lg mb-6">
              <p className="text-gray-500 dark:text-gray-400">พลังงานเพื่อรักษาน้ำหนัก</p>
              <p className="text-3xl font-bold text-primary-500 dark:text-primary-400 my-1">
                {formatNumberWithCommas(result.bmrCalorie)}
              </p>
              <p className="text-gray-500 dark:text-gray-400">แคลอรี่/วัน</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-700 dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-4 py-3">เป้าหมาย</th>
                    <th scope="col" className="px-4 py-3">น้ำหนัก</th>
                    <th scope="col" className="px-4 py-3 text-right">แคลอรี่/วัน</th>
                    <th scope="col" className="px-4 py-3 text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {result.behaviours.map(behaviour => {
                    const rgb = hexToRgb(behaviour.colorCode);
                    const backgroundColor = rgb ? `rgba(${rgb.join(', ')}, 0.15)` : 'transparent'; // ใช้ 15% opacity
                    return (
                      <tr key={behaviour.name} className="border-b dark:border-gray-700">
                        <td className={`px-4 font-semibold `}>
                          <div className='px-4 py-1 rounded-md' style={{ color: `${behaviour.colorCode}`, backgroundColor: backgroundColor }}>
                            {behaviour.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold">{`${behaviour.weight} ${behaviour.unitName}`}</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatNumberWithCommas(behaviour.calorie)}</td>
                        <td className="px-4 py-3 text-right font-semibold">{behaviour.percent.toFixed(0)}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center ...">
            <p>กรอกข้อมูลและกดคำนวณ...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BmrResultDisplay;