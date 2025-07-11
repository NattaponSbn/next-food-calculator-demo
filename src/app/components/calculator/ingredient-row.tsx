'use client';

import { TextInput } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { MasterRawSelectedIngredientModel } from '@/app/core/models/master/raw-material/raw-material.model';

interface IngredientRowProps {
  ingredient: MasterRawSelectedIngredientModel;
  isViewMode: boolean;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export const IngredientRow = ({ ingredient, isViewMode, onUpdateQuantity, onRemove }: IngredientRowProps) => {
  return (
    <div className="flex items-center gap-3 p-2 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <span className="flex-grow font-medium text-gray-900 dark:text-white">{ingredient.data.name}</span>
      <div className="w-24 flex-shrink-0">
        <TextInput type="number" className="form-control form-rounded-xl" value={ingredient.quantity} onChange={(e) => onUpdateQuantity(ingredient.id, parseFloat(e.target.value) || 0)} sizing="sm" min="0" disabled={isViewMode} />
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