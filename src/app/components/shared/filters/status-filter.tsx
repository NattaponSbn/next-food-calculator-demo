// components/filters/StatusFilter.tsx

import React, { useState, useMemo } from 'react'; // เพิ่ม useMemo
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';

// 1. [แก้ไข] สร้าง Type สำหรับ item แต่ละตัว
// ทำให้ยืดหยุ่น โดยขอแค่มี id และ name
export interface FilterListItem {
  id: string | number;
  name: string;
}

// 2. [แก้ไข] ปรับปรุง Props ของ Component
interface StatusFilterProps {
  items: FilterListItem[]; // รับ Array ของ items เข้ามา
  initialValue?: (string | number)[]; // ค่าที่ถูกเลือกไว้ตอนแรก
  onApply: (value: (string | number)[]) => void;
  onClose: () => void;
  title?: string; // (Optional) เพิ่ม title สำหรับ Popup
}

export function StatusFilter({
  items,
  initialValue = [],
  onApply,
  onClose,
  title = 'Filter by Status',
}: StatusFilterProps) {
  // 3. ปรับ State ให้รองรับทั้ง string และ number
  const [selected, setSelected] = useState<Set<string | number>>(new Set(initialValue));
  const [searchTerm, setSearchTerm] = useState('');

  // 4. [สำคัญ] Filter รายการตาม searchTerm ที่ผู้ใช้พิมพ์
  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return items;
    }
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);


  const handleToggle = (id: string | number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  const handleApply = () => {
    onApply(Array.from(selected));
  };

  return (
    <div className="flex w-80 flex-col gap-4">
      <h4 className="font-semibold">{title}</h4>
      <TextInput 
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="max-h-60 overflow-y-auto border-t border-b py-2">
        {filteredItems.length > 0 ? (
          <table className="w-full text-sm">
            <tbody>
              {/* 5. วนลูปจาก filteredItems */}
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td className="p-2">
                    <Checkbox 
                      id={`status-${item.id}`}
                      checked={selected.has(item.id)}
                      onChange={() => handleToggle(item.id)}
                    />
                  </td>
                  <td className="w-full p-2">
                    <Label htmlFor={`status-${item.id}`} className="w-full cursor-pointer">
                      {item.name}
                    </Label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">
            No results found.
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button size="sm" color="gray" onClick={onClose}>Close</Button>
        <Button size="sm" color="blue" onClick={handleApply}>Ok</Button>
      </div>
    </div>
  );
};