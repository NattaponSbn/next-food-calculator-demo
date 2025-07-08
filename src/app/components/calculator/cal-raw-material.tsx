'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useModal } from '@/app/core/hooks/use-modal';
import { RawMaterialSelectModal, RawMaterialSelectProps } from './raw-material-select-modal';
import { IngredientRow } from './ingredient-row';
import { NutritionSummary } from './nutrition-summary';
import { useDebounce } from '@/app/core/hooks/use-debounce';

// --- Import Component ย่อย ---
// --- Import Types ---
// แนะนำให้สร้างไฟล์ types.ts เพื่อเก็บ Interface เหล่านี้
interface MasterRawMaterialItem {
  rawMaterialObjectId: string;
  nameThai: string;
  nameEng: string;
  baseUnit: string;
}
export interface SelectedIngredient {
  id: string;
  data: MasterRawMaterialItem;
  quantity: number;
  unit: string;
}
export interface NutritionSummaryModel {
  mainNutrients: { [key: string]: string };
  vitamins: { [key: string]: string };
  minerals: { [key: string]: string };
}
// ------------------------------------

const CalculatorRawMaterialPage = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummaryModel | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const showSelectModal = useModal<RawMaterialSelectProps, any>(RawMaterialSelectModal);
  const debouncedIngredients = useDebounce(selectedIngredients, 500);

  const calculateNutrition = useCallback(async () => {
    if (debouncedIngredients.length === 0) {
      setNutritionSummary(null); return;
    }
    setIsCalculating(true);
    try {
      const requestBody = { items: debouncedIngredients.map(item => ({ rawMaterialId: item.id, quantity: item.quantity, unit: item.unit })) };
      console.log('Calling API to calculate with:', requestBody);
      await new Promise(r => setTimeout(r, 800)); // Mock API delay
      const mockSummary: NutritionSummaryModel = {
        mainNutrients: { Protein: `${(Math.random() * 50).toFixed(2)}g`, Fat: `${(Math.random() * 20).toFixed(2)}g`, Carbs: `${(Math.random() * 100).toFixed(2)}g` },
        vitamins: { 'Vitamin C': `${(Math.random() * 100).toFixed(2)}mg`, 'Vitamin A': `${(Math.random() * 500).toFixed(2)}μg` },
        minerals: { Calcium: `${(Math.random() * 1000).toFixed(2)}mg`, Iron: `${(Math.random() * 10).toFixed(2)}mg` },
      };
      setNutritionSummary(mockSummary);
    } catch (error) {
      console.error("Calculation failed:", error);
    } finally {
      setIsCalculating(false);
    }
  }, [debouncedIngredients]);

  useEffect(() => {
    calculateNutrition();
  }, [calculateNutrition]);

  const handleOpenModal = async () => {
    try {
      const selectedItems = await showSelectModal({ mode: 'create', size: 'lg:max-w-3xl lg:min-w-[1080px]' });
      if (selectedItems && selectedItems.length > 0) {
        handleAddIngredients(selectedItems);
      }
    } catch (error) {
      console.info("Modal selection was cancelled.");
    }
  };

  const handleAddIngredients = (newItems: MasterRawMaterialItem[]) => {
    setSelectedIngredients(prevItems => {
      const existingIds = new Set(prevItems.map(item => item.id));
      const itemsToAdd = newItems.filter(newItem => !existingIds.has(newItem.rawMaterialObjectId)).map(newItem => ({
        id: newItem.rawMaterialObjectId, data: newItem, quantity: 100, unit: newItem.baseUnit,
      }));
      return [...prevItems, ...itemsToAdd];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setSelectedIngredients(items => items.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  const handleRemoveIngredient = (id: string) => {
    setSelectedIngredients(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
      <div className="lg:col-span-3">
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title mb-2">รายการวัตถุดิบ</h2>
            <Button onClick={handleOpenModal} color="blue" size="sm" className='btn'>
              <Icon icon="mdi:plus-box-outline" className="mr-2 h-5 w-5" />
              เพิ่มวัตถุดิบ
            </Button>
          </div>
          <div className="panel-body space-y-3">
            {selectedIngredients.length > 0 ? (
              selectedIngredients.map(item => (
                <IngredientRow key={item.id} ingredient={item} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveIngredient}/>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500"><p>ยังไม่มีวัตถุดิบ</p><p className="text-sm">กด "เพิ่มวัตถุดิบ" เพื่อเริ่มต้น</p></div>
            )}
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <NutritionSummary summary={nutritionSummary} isLoading={isCalculating} />
      </div>
    </div>
  );
};

export default CalculatorRawMaterialPage;