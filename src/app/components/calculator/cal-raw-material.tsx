'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useModal } from '@/app/core/hooks/use-modal';
import { RawMaterialSelectModal, RawMaterialSelectProps } from './modals/raw-material-select-modal';
import { IngredientRow } from './ingredient-row';
import { NutritionSummary } from './nutrition-summary';
import { useDebounce } from '@/app/core/hooks/use-debounce';
import { MasterRawMaterialItemsModel, MasterRawNutritionSummaryModel, MasterRawSelectedIngredientModel } from '@/app/core/models/master/raw-material/raw-material.model';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModeTypes } from '@/app/core/models/const/type.const';
import { showConfirmation, showSuccessAlert, showWarningAlert } from '@/app/lib/swal';
import { useTranslation } from 'react-i18next';
import { recipeService } from '@/app/core/services/calculator/recipe.service';
import { CalculationRequestItem, CalculatorGroupNutrientModel, CalculatorRequestItemModel, NutritionSummaryResponse } from '@/app/core/models/calculator/calculator.mode';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export type Mode = typeof ModeTypes[keyof typeof ModeTypes];

const calculatorRawMaterialSchemaDefinition = (t: (key: string) => string) => z.object({
  calculationName: z.string().min(1, { message: t('require.pleaseInput') }),
});

export type CalculatorRawMaterialFormValues = z.infer<ReturnType<typeof calculatorRawMaterialSchemaDefinition>>;

const CalculatorRawMaterialPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const mode: Mode = (searchParams.get('mode') as Mode) || '';
  const calculationId = Number(searchParams.get('id'));
  const isViewMode = mode === ModeTypes.view;

  const [calculationName, setCalculationName] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<MasterRawSelectedIngredientModel[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummaryResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(mode !== 'create');
  const hasUserInteracted = useRef(false);

  const showSelectModal = useModal<RawMaterialSelectProps, any>(RawMaterialSelectModal);
  const debouncedIngredients = useDebounce(selectedIngredients, 500);

  const calculatorRawMaterialSchema = useMemo(() => calculatorRawMaterialSchemaDefinition(t), [t]);

  const {
    register,
    handleSubmit,
    reset, // <-- เพิ่ม 'reset' เพื่ออัปเดตค่าในฟอร์ม
    formState: { errors, isSubmitting },
  } = useForm<CalculatorRawMaterialFormValues>({
    resolver: zodResolver(calculatorRawMaterialSchema),
    // ค่าเริ่มต้นให้เป็นค่าว่างไปก่อน แล้วเราจะใช้ useEffect + reset มาใส่ทีหลัง
    defaultValues: { calculationName: '' },
  });

  // [ปรับปรุง] ทำให้รับ ingredients เป็น parameter
  const calculateNutritionApi = useCallback(async (ingredients: MasterRawSelectedIngredientModel[]) => {
    // 1. ตรวจสอบจาก parameter ที่รับเข้ามา
    if (ingredients.length === 0) {
      setNutritionSummary(null);
      return null; // คืนค่า null เพื่อให้รู้ว่าไม่ได้คำนวณ
    }

    setIsCalculating(true);
    try {
      const dataRequest: CalculationRequestItem[] = ingredients.map(item => ({
        ingredientId: item.id,
        dataPerUnit: item.quantity, // API ของคุณต้องการ dataPerUnit
        perUnitId: item.data.perUnitId,
      }));
      const requestBody = {
        ingredients: dataRequest
      };

      console.log('Calling calculation API with:', requestBody);
      const summary = await recipeService.calculate(requestBody);
      setNutritionSummary(summary);
      return summary; // 2. คืนค่าผลลัพธ์ที่ได้จากการคำนวณ

    } catch (error) {
      console.error("Calculation failed:", error);
      setNutritionSummary(null);
      return null; // คืนค่า null เมื่อเกิดข้อผิดพลาด
    } finally {
      setIsCalculating(false);
    }
  }, []); // 3. Dependency array ว่าง เพราะไม่ขึ้นกับ state ภายนอกโดยตรง

  // [แก้ไข] useEffect หลัก สำหรับโหลดและคำนวณครั้งแรก
  useEffect(() => {
    hasUserInteracted.current = false; 
    const loadInitialData = async () => {
      // ทำงานเฉพาะโหมด edit/view และมี id เท่านั้น
      if ((mode === ModeTypes.edit || mode === ModeTypes.view) && calculationId) {
        try {
          // 1. ดึงข้อมูล Recipe เก่าจาก API
          const recipeData = await recipeService.getById(calculationId);

          // 2. อัปเดต State ชื่อและรายการวัตถุดิบ
          // setCalculationName(recipeData.name);
          reset({
            calculationName: recipeData.name,
          });

          // *** สำคัญ: ต้องแปลงข้อมูลที่ได้จาก API ให้เป็นรูปแบบ SelectedIngredient ***
          const initialIngredients: MasterRawSelectedIngredientModel[] = recipeData.ingredients.map(ing => ({
            id: ing.ingredientId, // สมมติว่า API คืนข้อมูลวัตถุดิบมาด้วย
            data: {
              kind: ing.kind,
              id: ing.ingredientId,
              name: ing.ingredientName,
              dataPerUnit: ing.dataPerUnit,
              perUnitId: ing.perUnitId,
              perUnitName: ing.perUnitName,
            },
            quantity: ing.dataPerUnit,
            unit: ing.perUnitName,
          }));
          setSelectedIngredients(initialIngredients);
          setNutritionSummary(recipeData.groupNutrients)

          // 3. "เรียก" การคำนวณสารอาหารทันทีด้วยข้อมูลใหม่ที่เพิ่งได้มา
          //    และ await รอให้มันคำนวณเสร็จ
          // await calculateNutritionApi(initialIngredients);

        } catch (error) {
          console.error("Failed to load initial data", error);
          router.push('/ui/calculation-history'); // กลับหน้ารายการถ้าหาไม่เจอ
        } finally {
          // 4. ปิดสถานะ Loading ของ "ทั้งหน้า" เมื่อทุกอย่างเสร็จสิ้น
          setIsPageLoading(false);
        }
      } else {
        setIsPageLoading(false);
      }
    };

    loadInitialData();
  }, [mode, calculationId, reset]); // Dependency เหลือเท่าที่จำเป็นสำหรับการโหลดครั้งแรก

  // [แก้ไข] useEffect สำหรับการคำนวณ "หลังจาก" ผู้ใช้แก้ไข
  useEffect(() => {
   if (isPageLoading || !hasUserInteracted.current) {
      return;
    }
     calculateNutritionApi(debouncedIngredients);
  }, [debouncedIngredients, isPageLoading, calculateNutritionApi]);

  const handleOpenModal = async () => {
    try {
      const selectedItems = await showSelectModal({ mode: 'create', size: '5xl' });
      if (selectedItems && selectedItems.length > 0) {
        handleAddIngredients(selectedItems);
      }
    } catch (error) {
      console.info("Modal selection was cancelled.");
    }
  };

  const handleAddIngredients = (newItems: MasterRawMaterialItemsModel[]) => {
     hasUserInteracted.current = true;
    setSelectedIngredients(prevItems => {
      const existingIds = new Set(prevItems.map(item => item.id));
      const itemsToAdd = newItems
        .filter(newItem => !existingIds.has(newItem.id))
        .map((newItem): MasterRawSelectedIngredientModel => ({ // ใช้ Type ที่ถูกต้อง
          id: newItem.id,
          data: newItem,
          quantity: newItem.dataPerUnit,
          unit: newItem.perUnitName,
        }));

      if (itemsToAdd.length === 0) return prevItems;
      return [...prevItems, ...itemsToAdd];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
     hasUserInteracted.current = true;
    setSelectedIngredients(prevItems =>
      prevItems.map(item => {
        // 1. ตรวจสอบว่าใช่ item ที่ต้องการแก้ไขหรือไม่
        if (item.id === id) {
          // 2. ถ้าใช่, ให้คืนค่าเป็น object "ใหม่" ที่มีค่า quantity อัปเดตแล้ว
          //    การใช้ spread operator (...) ทำให้เรา copy ค่าเดิมมาทั้งหมด
          return { ...item, quantity: quantity };
        }
        // 3. ถ้าไม่ใช่, ให้คืนค่า item เดิมกลับไปโดยไม่มีการเปลี่ยนแปลง
        return item;
      })
    );
  };

  const handleRemoveIngredient = (id: number) => {
     hasUserInteracted.current = true;
    setSelectedIngredients(prevItems =>
      // ใช้ .filter() เพื่อสร้าง Array ใหม่
      // โดยจะเก็บไว้เฉพาะ item ที่มี id "ไม่ตรงกับ" id ที่ต้องการลบ
      prevItems.filter(item => item.id !== id)
    );
  };

  const handleSaveOrUpdate = async (data: CalculatorRawMaterialFormValues, isSaveNext: boolean, redirectAfterSave: boolean = true) => {
    const ingredientsPayload: CalculationRequestItem[] = selectedIngredients.map(item => ({
      ingredientId: item.id,
      dataPerUnit: item.quantity,
      perUnitId: item.data.perUnitId, // ดึง perUnitId จาก data ที่เก็บไว้
    }));

    // ไม่ต้องมี showConfirmation ที่นี่แล้ว จะย้ายไปจัดการที่ปุ่ม
    const requestBody: CalculatorRequestItemModel = {
      // ---- ข้อมูลของ Recipe ----
      name: data.calculationName,
      nameEN: '', // หรืออาจจะมีช่องให้กรอกแยก
      code: ``, // อาจจะสร้าง code ชั่วคราว หรือให้ Backend จัดการ
      description: ``,
      groupId: 1, // ต้องมีค่า default หรือให้ผู้ใช้เลือก
      dataPerUnit: 0,
      perUnitId: 0,
      // ---- รายการ Ingredients ----
      ingredients: ingredientsPayload,

      // ---- ส่วนนี้ไม่ได้อยู่ใน Request Model, ไม่ต้องส่งไป ----
      // dataPerUnit: 0, 
      // perUnitId: 0,
    };

    let savedData; // ตัวแปรสำหรับเก็บข้อมูลที่บันทึก/อัปเดตแล้ว

    if(isSaveNext) {
      savedData = await recipeService.create(requestBody);
    } else {
      if (mode === 'create') {
        savedData = await recipeService.create(requestBody);

      } else if (mode === 'edit' && calculationId) {
        savedData = await recipeService.update(calculationId, requestBody);
      }
    }
    

    showSuccessAlert();

    // --- Logic การตัดสินใจหลังบันทึก ---
    if (redirectAfterSave) {
      // ถ้าต้องการ redirect ให้กลับไปหน้ารายการ
      router.push('/ui/calculator-history');
    } else {
      // ถ้าไม่, และเป็นการสร้างใหม่, ให้เปลี่ยน URL เป็นโหมด edit
      // เพื่อให้การกด "Save and Continue" ครั้งต่อไปเป็นการ update
      if (mode === 'create') {
        reset();

        // 2. เคลียร์ State ของชื่อการคำนวณ
        setCalculationName('');

        // 3. เคลียร์ State ของรายการวัตถุดิบ
        setSelectedIngredients([]);
      }
      // ถ้าเป็นโหมด edit อยู่แล้ว ก็ไม่ต้องทำอะไร อยู่หน้าเดิมต่อได้เลย
    }
  };

  // --- [ใหม่] สร้าง Handler สำหรับแต่ละปุ่มเพื่อความชัดเจน ---
  const onSaveAndExit = async (data: CalculatorRawMaterialFormValues) => {
    if (selectedIngredients.length === 0) {
      // ใช้ toast หรือ alert ที่ดีกว่านี้
      showWarningAlert(t('alertText.pleaseEnterCalculationAddLeastOne'))
      return;
    }
    const confirmResult = await showConfirmation();
    if (confirmResult.isConfirmed) {
      await handleSaveOrUpdate(data, false, true); // true = redirect
    }
  };

  const onSaveAndContinue = async (data: CalculatorRawMaterialFormValues) => {
    if (selectedIngredients.length === 0) {
      // ใช้ toast หรือ alert ที่ดีกว่านี้
      showWarningAlert(t('alertText.pleaseEnterCalculationAddLeastOne'))
      return;
    }
    // สำหรับปุ่มนี้ อาจจะไม่ต้องถามซ้ำ หรือใช้ข้อความอื่น
    const confirmResult = await showConfirmation();
    if (confirmResult.isConfirmed) {
      await handleSaveOrUpdate(data, true, true); // false = stay on page
    }
  };

  const onBack = async () => {
    router.push('/ui/calculator-history');
  };

  const titles: Record<Mode, string> = {
    ['']: t('calculator.new'),
    [ModeTypes.create]: t('calculator.create'),
    [ModeTypes.edit]: t('calculator.edit'),
    [ModeTypes.view]: t('calculator.detail'),
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {titles[mode]}
          </h1>
          <p className="text-sm text-gray-500">{t('calculator.pageSubtitle')}</p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          {isViewMode ? (
            <></>
          ) : (
            <>
              {/* ปุ่ม Save/Update (แล้วกลับหน้ารายการ) */}
              <Button color="success" onClick={handleSubmit(onSaveAndExit)} disabled={isCalculating}>
                <Icon icon="mdi:content-save-all" className="mr-2 h-5 w-5" />
                {(mode === 'edit' && '') ? t('button.update') : t('button.save')}
              </Button>
              {/* ปุ่ม Save and Continue Editing (จะแสดงเฉพาะโหมด Edit) */}
              {mode === 'edit' && (
                <Button color="light" onClick={handleSubmit(onSaveAndContinue)} disabled={isCalculating}>
                   {t('button.saveAndNext')}
                </Button>
              )}
            </>
          )}
          <Button color="gray" onClick={onBack}>
            {isViewMode ? t('button.back') : t('button.cancel')}
          </Button>
        </div>
      </div>
      <div className="panel p-4">
        <Label htmlFor="calculationName" value={t('calculator.name')} className="mb-2 block font-semibold" color={errors.calculationName && 'failure'} />
        <TextInput
          id="calculationName"
          {...register("calculationName")}
          placeholder={t('calculator.calculationNamePlaceholder')}
          className={`form-control form-rounded-xl ${errors.calculationName && 'has-error'}`}
          required
          disabled={isViewMode}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ฝั่งซ้าย: รายการวัตถุดิบ */}
        <div className="panel flex flex-col max-h-[60vh]">
          <div className="panel-header flex-shrink-0">
            <h2 className="panel-title">{t('calculator.ingredientListTitle')}</h2>
            {!isViewMode && (
              <Button onClick={handleOpenModal} color="blue" size="sm">
                <Icon icon="mdi:plus" className="mr-2 h-5 w-5" />
                 {t('calculator.addIngredient')}
              </Button>
            )}

          </div>
          <div className="panel-body flex-grow overflow-y-auto space-y-3">
            {selectedIngredients.length > 0 ? (
              selectedIngredients.map(item => (
                <IngredientRow key={item.id} ingredient={item} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveIngredient} isViewMode={isViewMode} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500">
                <Icon icon="mdi:package-variant-remove" className="w-12 h-12 text-gray-300 mb-2" />
                <p className="font-semibold">{t('calculator.noIngredients')}</p>
                <p className="text-sm">{t('calculator.noIngredientsHint')}</p>
              </div>
            )}
          </div>
        </div>

        {/* ฝั่งขวา: สรุปสารอาหาร */}
        <NutritionSummary
          summary={nutritionSummary}
          isLoading={isCalculating}
        />

      </div>
    </div>

  );
};

export default CalculatorRawMaterialPage;