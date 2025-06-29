import React, { useState } from 'react';
import { Button, Label, Select, TextInput } from 'flowbite-react';
import { DateFilterCondition, DateFilterRequestModel } from '@/app/core/models/shared/date-filter.model';

interface DateFilterProps {
 initialValue?: DateFilterRequestModel;
  onApply: (value: DateFilterRequestModel | undefined | null) => void;
  onClose: () => void;
}

export function DateFilter({ 
  initialValue, onApply, onClose 
  } : DateFilterProps) {
  const [condition, setCondition] = useState<DateFilterCondition>(
    initialValue?.condition || DateFilterCondition.GreaterThanOrEqual
  );
  const [fromDate, setFromDate] = useState(initialValue?.fromDate || '');
  const [toDate, setToDate] = useState(initialValue?.toDate || '');

  const isRange = condition === DateFilterCondition.Range;

  const conditionOptions = [
    { value: DateFilterCondition.GreaterThanOrEqual, label: '≥ (มากกว่าหรือเท่ากับ)' },
    { value: DateFilterCondition.LessThanOrEqual, label: '≤ (น้อยกว่าหรือเท่ากับ)' },
    { value: DateFilterCondition.Equal, label: '= (เท่ากับ)' },
    { value: DateFilterCondition.Range, label: 'ระหว่าง (Range)' },
    { value: DateFilterCondition.GreaterThan, label: '> (มากกว่า)' },
    { value: DateFilterCondition.LessThan, label: '< (น้อยกว่า)' },
  ];

 const handleApply = () => {
    // ตรวจสอบว่ามี fromDate ถึงจะ Apply
    if (fromDate) {
      // สร้าง instance ของ Model เพื่อส่งกลับไป
      const result = new DateFilterRequestModel(
        condition,
        fromDate,
        isRange ? toDate : '' // ส่ง toDate ก็ต่อเมื่อเป็น Range
      );
      onApply(result);
    } else {
      // ถ้าไม่มี fromDate ให้ถือว่าเป็นการเคลียร์ filter
      onApply(undefined);
    }
  };

  return (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3 border-t border-b py-4">
        {/* Condition Select */}
        <div className="flex-shrink-0">
          <Label htmlFor="date-condition" value="เงื่อนไข" className="mb-2 block" />
          <Select 
            id="date-condition"
            value={condition} 
            className='form-control form-rounded-xl' 
            onChange={e => setCondition(e.target.value as DateFilterCondition)}
          >
            {conditionOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </div>

        {/* From Date Input */}
        <div className="flex-shrink-0">
          <Label htmlFor="from-date" value={isRange ? "จากวันที่" : "วันที่"} className="mb-2 block" />
          <TextInput 
            id="from-date"
            type="date" 
            className='form-control form-rounded-xl' 
            value={fromDate} 
            onChange={e => setFromDate(e.target.value)} 
          />
        </div>

        {/* To Date Input (แสดงเมื่อเป็น Range) */}
        {isRange && (
          <div className="flex-shrink-0">
            <Label htmlFor="to-date" value="ถึงวันที่" className="mb-2 block" />
            <TextInput 
              id="to-date"
              type="date" 
              className='form-control form-rounded-xl' 
              value={toDate} 
              onChange={e => setToDate(e.target.value)} 
            />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 border-t pt-3">
        <Button size="sm" color="gray" onClick={onClose}>Close</Button>
        <Button size="sm" color="blue" onClick={handleApply}>Confirm</Button>
      </div>
    </div>
  );
};