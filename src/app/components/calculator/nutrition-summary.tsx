'use client';

import { Spinner } from 'flowbite-react';
import { NutritionSummaryModel } from './cal-raw-material';

interface NutritionSummaryProps {
  summary: NutritionSummaryModel | null;
  isLoading: boolean;
}

export const NutritionSummary = ({ summary, isLoading }: NutritionSummaryProps) => {
  if (isLoading) {
    return (
      <div className="panel flex items-center justify-center h-full min-h-[300px]">
        <Spinner size="xl" />
        <span className="ml-3 text-gray-500">กำลังคำนวณ...</span>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="panel flex items-center justify-center h-full min-h-[300px]">
        <p className="text-gray-500">ผลรวมสารอาหารจะแสดงที่นี่</p>
      </div>
    );
  }
  
  const renderGroup = (title: string, nutrients: { [key: string]: string }) => (
    Object.keys(nutrients).length > 0 && (
      <div key={title} className="mb-6">
        <h3 className="font-semibold text-lg border-b pb-2 mb-3 text-gray-800 dark:text-white">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
          {Object.entries(nutrients).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{key}:</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">{value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  );
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">สรุปคุณค่าทางโภชนาการ</h2>
      </div>
      <div className="panel-body">
        {renderGroup("Main Nutrients", summary.mainNutrients)}
        {renderGroup("Vitamins", summary.vitamins)}
        {renderGroup("Minerals", summary.minerals)}
      </div>
    </div>
  );
};