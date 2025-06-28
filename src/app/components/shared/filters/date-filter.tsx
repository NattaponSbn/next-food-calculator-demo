import React, { useState } from 'react';
import { Button, Select, TextInput } from 'flowbite-react';

interface DateFilterProps {
  initialValue?: { condition: string; date: string };
  onApply: (value: { condition: string; date: string }) => void;
  onClose: () => void;
}

export function DateFilter({ 
  initialValue, onApply, onClose 
  } : DateFilterProps) {
  const [condition, setCondition] = useState(initialValue?.condition || '>=');
  const [date, setDate] = useState(initialValue?.date || '');

  const handleApply = () => {
    if(date) {
      onApply({ condition, date });
    }
  };

  return (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex items-end gap-2">
        <div>
          <label className="text-sm">Condition</label>
          <Select value={condition} onChange={e => setCondition(e.target.value)}>
            <option value=">=">≥</option>
            <option value="<=">≤</option>
            <option value="=">=</option>
            <option value=">">{'>'}</option>
            <option value="<">{'<'}</option>
          </Select>
        </div>
        <div>
          <label className="text-sm">Date</label>
          <TextInput type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t pt-3">
        <Button size="sm" color="gray" onClick={onClose}>Close</Button>
        <Button size="sm" color="blue" onClick={handleApply}>Confirm</Button>
      </div>
    </div>
  );
};