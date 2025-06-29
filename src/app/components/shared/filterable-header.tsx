// components/shared/FilterableHeader.tsx
import React from 'react';
import { TextInput } from 'flowbite-react';
import { Column } from '@tanstack/react-table';
import { Icon } from '@iconify/react';

// Props ที่ Component นี้จะรับ
interface FilterControlProps {
    column: Column<any, unknown>;
    title?: string;
    placeholder?: string;
    // เพิ่ม meta เข้ามาเพื่ออ่าน filterType
    meta: { filterType?: 'text' | 'status' | 'date' } | undefined;
    onFilterIconClick: (event: React.MouseEvent<HTMLButtonElement>, column: Column<any, unknown>) => void;
}

export const FilterControl: React.FC<FilterControlProps> = ({ column, title, placeholder, meta, onFilterIconClick }) => {
    const filterType = meta?.filterType;
    const currentValue = column.getFilterValue();
    const isFiltered = column.getIsFiltered();

    const handleClearFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // ป้องกันไม่ให้ event click ลามไปเปิด Popup
        if(filterType === 'status') column.setFilterValue([]); // การ set ค่าเป็น undefined คือการเคลียร์ filter
        if(filterType === 'date') column.setFilterValue(undefined); // การ set ค่าเป็น undefined คือการเคลียร์ filter
    };

    const renderFilterControl = () => {
        // ใช้ switch-case เพื่อเลือก UI ที่จะ render
        switch (filterType) {
            // --- กรณี Text Filter ---
            case 'text':
                return (
                    <TextInput
                        id={column.id}
                        type="text"
                        value={(currentValue as string) ?? ''}
                        onChange={(e) => column.setFilterValue(e.target.value)}
                        placeholder={`${placeholder}`}
                        onClick={(e) => e.stopPropagation()} // ป้องกัน event อื่นๆ เช่น sorting
                        className="form-control form-rounded-xl"
                    />
                );

            // --- กรณี Status และ Date Filter ---
            case 'status':
                {
                    const currentStatusValue = currentValue as string[];
                    const isStatusFiltered = currentStatusValue?.length > 0;
                    return (
                        <div className="flex items-center gap-1">
                            {/* 1. ปุ่ม Filter (แสดงเสมอ) */}
                            <button
                                onClick={(e) => onFilterIconClick(e, column)}
                                title="Filter"
                            >
                                <Icon
                                    icon="mdi:filter-variant"
                                    className={`h-4 w-4 ${isStatusFiltered ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                />
                            </button>

                            {/* 2. [เพิ่มใหม่] ปุ่ม Clear (แสดงเมื่อมีการ filter) */}
                            {isStatusFiltered && (
                                <button
                                    onClick={handleClearFilter}
                                    className="text-red-500 hover:text-red-700"
                                    title="Clear Filter"
                                >
                                    <Icon icon="mdi:close-circle-outline" className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    );
                }

            case 'date':
                return (
                    <div className="flex items-center gap-1">
                        {/* 1. ปุ่ม Filter (แสดงเสมอ) */}
                        <button
                            onClick={(e) => onFilterIconClick(e, column)}
                            title="Filter"
                        >
                            <Icon
                                icon="mdi:filter-variant"
                                className={`h-4 w-4 ${isFiltered ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            />
                        </button>

                        {/* 2. [เพิ่มใหม่] ปุ่ม Clear (แสดงเมื่อมีการ filter) */}
                        {isFiltered && (
                            <button
                                onClick={handleClearFilter}
                                className="text-red-500 hover:text-red-700"
                                title="Clear Filter"
                            >
                                <Icon icon="mdi:close-circle-outline" className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                );

            // --- กรณีไม่มี Filter ---
            default:
                // คืนค่า null หรือ div ว่างๆ เพื่อให้ layout ไม่พัง
                return <div className="h-8 w-full"></div>;
        }
    };

    return (
        title ? ( // ตรวจสอบว่า title มีค่าและไม่ใช่ string ว่าง
            // ถ้ามี title
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="font-semibold">{title}</div>
                {renderFilterControl()}
            </div>
        ) : (
            // ถ้าไม่มี title
            renderFilterControl()
        )

    );
};