// src/app/components/shared/table-status-row.tsx
'use client';

import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

interface TableStatusRowProps {
  /** จำนวนคอลัมน์ทั้งหมดของตาราง เพื่อให้ cell ขยายเต็มความกว้าง */
  colSpan: number;
  /** สถานะที่จะแสดงผล: 'loading', 'no-data', หรือ 'error' */
  status: 'loading' | 'no-data' | 'error';
  /** (Optional) ข้อความ error ที่จะแสดงผล */
  errorMessage?: string;
}

export const TableStatusRow = ({
  colSpan,
  status,
  errorMessage = 'An unexpected error occurred.',
}: TableStatusRowProps) => {
  const { t } = useTranslation();

  const statusMap = {
    loading: {
      icon: 'line-md:loading-twotone-loop',
      text: t('system.loading'),
      message: '',
      iconClass: 'text-blue-500',
    },
    'no-data': {
      icon: 'mdi:database-off-outline',
      text: t('system.noDataFound'),
      message: '',
      iconClass: 'text-gray-400',
    },
    error: {
      icon: 'mdi:alert-circle-outline',
      text: t('system.error.title'),
      message: errorMessage,
      iconClass: 'text-red-500',
    },
  };

  const currentStatus = statusMap[status];

  return (
    <tr>
      <td colSpan={colSpan} className="text-center p-8">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Icon
            icon={currentStatus.icon}
            width="48"
            className={currentStatus.iconClass}
          />
          <span className="font-semibold text-lg">{currentStatus.text}</span>
          {status === 'error' && (
            <span className="text-sm text-gray-400">{currentStatus.message}</span>
          )}
        </div>
      </td>
    </tr>
  );
};