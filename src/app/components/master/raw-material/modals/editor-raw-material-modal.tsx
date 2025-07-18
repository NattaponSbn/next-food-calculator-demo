import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, HelperText, Label, Select, TextInput } from 'flowbite-react';
import { InjectedModalProps } from '@/app/core/hooks/use-modal';
import { ModalFrame, ModalSize } from '@/app/components/shared/modals/modal-frame';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showConfirmation, showSuccessAlert } from '@/app/lib/swal';
import { ModeTypes } from '@/app/core/models/const/type.const';
import { CommonModel, NutritionCommonModel, SuccessResponse, UnitCommonModel } from '@/app/core/models/shared/common.model';
import { MasterRawMaterialRequestItemModel, MasterRawMaterialResponseItemModel } from '@/app/core/models/master/raw-material/raw-material.model';
import { nutritionService } from '@/app/core/services/master/nutrition.service';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ingredientGroupService } from '@/app/core/services/master/ingredient-group.service';
import { unitsService } from '@/app/core/services/master/units.service';
import { ingredientService } from '@/app/core/services/master/ingredient.service';

// 2. Types
export type Mode = typeof ModeTypes[keyof typeof ModeTypes];

// Schema สำหรับสารอาหารแต่ละแถว
const nutritionEntrySchema = z.object({
  nutritionId: z.coerce.number({ required_error: 'กรุณาเลือกสารอาหาร' })
    .min(1, { message: 'กรุณาเลือกสารอาหาร' }),
  unitId: z.coerce.number({ required_error: 'กรุณาเลือกหน่วย' })
    .min(1, { message: 'กรุณาเลือกหน่วย' }),

  value: z.coerce.number({ invalid_type_error: 'กรุณากรอกตัวเลข' })
    .min(0, { message: 'ค่าต้องไม่ติดลบ' }),
});

// Schema หลักของฟอร์มวัตถุดิบ
const rawMaterialSchemaDefinition = (t: (key: string) => string) => z.object({
  // --- ข้อมูลทั่วไป ---
  nameThai: z.string().min(1, { message: t('require.pleaseInput') }),
  nameEng: z.string().min(1, { message: t('require.pleaseInput') }),
  foodId: z.string().min(1, { message: t('require.pleaseInput') }),
  groupId: z.coerce.number({ required_error: t('require.pleaseSelect') })
    .min(1, { message: t('require.pleaseSelect') }), // ป้องกันค่า "" ที่อาจจะแปลงเป็น 0

  // --- ส่วนของโภชนาการ (เป็น Array) ---
  nutritions: z.array(nutritionEntrySchema),
});
export interface RawMaterialModalProps {
  mode: Mode;
  id?: number;
  size?: ModalSize;
}
type RawMaterialModalResult = RawMaterialFormValues & { id: string };
export type RawMaterialFormValues = z.infer<ReturnType<typeof rawMaterialSchemaDefinition>>;

// 4. The Modal Component
export function RawMaterialModal({
  mode,
  id,
  size,
  onConfirm,
  onClose,
}: RawMaterialModalProps & InjectedModalProps<SuccessResponse>) {
  const { t } = useTranslation();
  const isViewMode = mode === 'view';
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [ingredientGroupItems, setIngredientGroupItems] = useState<CommonModel[]>([]);
  const [nutritionItems, setNutritionItems] = useState<NutritionCommonModel[]>([]);
  const [unitItems, setUnitItems] = useState<UnitCommonModel[]>([]);
  const addNutrientButtonRef = useRef<HTMLButtonElement>(null);

  const rawMaterialSchema = useMemo(() => rawMaterialSchemaDefinition(t), [t]);

  const {
    control,
    register,
    handleSubmit,
    reset, // <-- เพิ่ม 'reset' เพื่ออัปเดตค่าในฟอร์ม
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RawMaterialFormValues>({
    resolver: zodResolver(rawMaterialSchema),
    // ค่าเริ่มต้นให้เป็นค่าว่างไปก่อน แล้วเราจะใช้ useEffect + reset มาใส่ทีหลัง
    defaultValues: {
      nameThai: '',
      nameEng: '',
      foodId: '',
      groupId: undefined,
      nutritions: [
        {
          nutritionId: 0, // หรือ ID เริ่มต้นถ้ามี
          unitId: 0,      // หรือ ID เริ่มต้นถ้ามี
          value: 0,
        }
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "nutritions", // ชื่อ field ที่เป็น array ใน Zod Schema
  });

  const transformApiDataToFormValues = (apiData: MasterRawMaterialResponseItemModel): RawMaterialFormValues => {
    return {
      // 1. Mapping ข้อมูลทั่วไป
      nameThai: apiData.name,
      nameEng: apiData.nameEN,
      foodId: apiData.foodId,
      groupId: apiData.groupId,

      // 2. Mapping Array ของ nutritions
     nutritions: (apiData.nutritions ?? []).map(nutrient => {
      //
      // `(apiData.nutritions ?? [])` หมายความว่า:
      // - ถ้า `apiData.nutritions` มีค่า (ไม่ใช่ null หรือ undefined), ให้ใช้ค่านั้น
      // - ถ้า `apiData.nutritions` เป็น null หรือ undefined, ให้ใช้ "Array ว่าง" (`[]`) แทน
      //
      // ผลลัพธ์คือ .map() จะทำงานกับ Array ว่าง ซึ่งจะไม่เกิด error
      // และจะคืนค่าเป็น Array ว่างกลับไป
      //

      const valueAsNumber = parseFloat(nutrient.value);

      return {
        nutritionId: nutrient.nutritionId,
        value: isNaN(valueAsNumber) ? 0 : valueAsNumber,
        unitId: nutrient.unitId,
      };
    }),
    };
  };


  useEffect(() => {
    const loadAllInitialData = async () => {
      setIsLoadingData(true);
      try {
        // 1. ยิง API เพื่อดึงข้อมูลสำหรับ Dropdown ทั้งหมดพร้อมกัน
        const [groupData, nutritionListData, unitData] = await Promise.all([
          ingredientGroupService.getAll(),
          nutritionService.getAll(),
          unitsService.getAll()
        ]);

        // 2. อัปเดต State ของ Dropdown ทั้งหมด
        setIngredientGroupItems(groupData.items);
        setNutritionItems(nutritionListData.items);
        setUnitItems(unitData.items);

        // 3. ตรวจสอบว่าเป็นโหมด Edit/View หรือไม่
        if ((mode === 'edit' || mode === 'view') && id) {
          // ถ้าใช่, ให้ดึงข้อมูลของรายการนั้นๆ ต่อ
          const rawMaterialData = await ingredientService.getById(id); // หรือ nutritionService ตามที่คุณใช้

          const formValues = transformApiDataToFormValues(rawMaterialData);

          // 3. Reset ฟอร์มด้วยข้อมูลที่แปลงแล้วทั้งหมดในครั้งเดียว
          reset(formValues);
        }

      } catch (error) {
        console.error("Failed to load modal initial data", error);
        // อาจจะแสดง toast แจ้งเตือนแล้วปิด Modal
        // toast.error('ไม่สามารถโหลดข้อมูลได้');
        // onClose();
      } finally {
        // 5. ปิด Loading เมื่อทุกอย่างเสร็จสิ้นสมบูรณ์
        setIsLoadingData(false);
      }
    };

    loadAllInitialData();
  }, [id, mode, reset, onClose]);

  // --- [เพิ่ม] useEffect สำหรับจัดการ Focus ---
  useEffect(() => {
    // ฟังก์ชันนี้จะทำงาน "หลังจาก" ที่ `fields` array เปลี่ยนแปลง
    // และ DOM ได้ถูกอัปเดตเรียบร้อยแล้ว
    // เราจะสั่งให้ focus กลับมาที่ปุ่ม "เพิ่มสารอาหาร"
    addNutrientButtonRef.current?.focus();

  }, [fields.length]); // 4. Dependency คือ "จำนวน" ของ item ใน fields

  const handleAddAllNutrients = () => {
    // 1. ดึง ID ของสารอาหารที่มีอยู่ในฟอร์มแล้ว
    const existingNutritionIds = new Set(
      fields.map(field => field.nutritionId) // fields มาจาก useFieldArray
    );

    // 2. กรองรายการสารอาหารทั้งหมด (จาก `nutritionItems` state)
    //    เอาเฉพาะตัวที่ยังไม่มีในฟอร์ม
    const nutrientsToAdd = nutritionItems.filter(
      nutrient => !existingNutritionIds.has(nutrient.id)
    );

    // 3. ถ้าไม่มีอะไรจะเพิ่ม ก็ไม่ต้องทำอะไรต่อ
    if (nutrientsToAdd.length === 0) {
      // (Optional) อาจจะแสดง Toast แจ้งเตือนว่า "เพิ่มสารอาหารครบทุกรายการแล้ว"
      console.log("All nutrients are already in the list.");
      return;
    }

    // 4. แปลงข้อมูลที่กรองแล้วให้อยู่ในรูปแบบที่ `append` ต้องการ
    const newFields = nutrientsToAdd.map(nutrient => ({
      nutritionId: nutrient.id,
      unitId: nutrient.primaryUnitId, // ใช้ unit เริ่มต้น
      value: 0,
    }));

    // 5. ใช้ `append` เพื่อเพิ่มข้อมูลทั้งหมดเข้าไปในครั้งเดียว
    //    `append` สามารถรับ Array ได้
    replace(newFields);
  };

  const handleAddNutrient = () => {
    // เพิ่ม object ใหม่เข้าไปใน array
    // คุณอาจจะต้องเปิด Modal ให้เลือกสารอาหารก่อน
    append({
      nutritionId: 0, // ID จากสารอาหารที่เลือก
      unitId: 0,      // ID ของหน่วย
      value: 0,
    });
  };

  const handleNutritionChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const selectedNutritionId = Number(event.target.value);

    // หาข้อมูลสารอาหารที่ถูกเลือกจาก list ทั้งหมด
    const selectedNutrient = nutritionItems.find(n => n.id === selectedNutritionId);

    if (selectedNutrient) {
        // ใช้ setValue เพื่ออัปเดตฟีลด์ unitId ของแถวที่ถูกต้อง (ตาม index)
        setValue(
            `nutritions.${index}.unitId`, 
            selectedNutrient.primaryUnitId, 
            { shouldValidate: true }
        );
    }
};

  const findNutritionNameById = (nutritionId: number): string => {
    const found = nutritionItems.find(n => n.id === nutritionId);
    return found ? found.name : '';
  };

  const onSubmit = async (data: RawMaterialFormValues) => {
    const request: MasterRawMaterialRequestItemModel = {
      // 1. Mapping ข้อมูลทั่วไป
      name: data.nameThai,
      nameEN: data.nameEng,
      foodId: data.foodId || '', // หรือค่า default อื่นๆ ถ้าจำเป็น
      description: '', // อาจจะมาจากฟอร์มหรือปล่อยว่าง
      groupId: data.groupId,

      // 2. Mapping ข้อมูลโภชนาการ
      // API ของคุณต้องการ dataPerUnit และ perUnitId ที่ระดับบนสุด
      // คุณต้องตัดสินใจว่าจะเอาค่านี้มาจากไหน (อาจจะเป็น input แยก)
      dataPerUnit: 100, // <<-- ตัวอย่าง, ต้องหาค่าที่ถูกต้องมาใส่
      perUnitId: 2,   // <<-- ตัวอย่าง, ต้องหาค่าที่ถูกต้องมาใส่

      // 3. Mapping Array ของ nutritions
      nutritions: data.nutritions.map(nutrient => ({
        nutritionId: Number(nutrient.nutritionId),
        value: String(nutrient.value), // แปลงเป็น string ตามที่ API ต้องการ
        unitId: Number(nutrient.unitId),
        // API ต้องการ nutritionName ด้วย แต่ในฟอร์มเรามีแค่ ID
        // เราอาจจะต้องหาชื่อจาก state ที่เก็บข้อมูล dropdown
        nutritionName: findNutritionNameById(nutrient.nutritionId),
      })),
    };

    let result: SuccessResponse;
    if (mode === 'create') {
      // เรียกใช้ service เพื่อสร้างข้อมูล
      result = await ingredientService.create(request);
    } else if (id) {
      // เรียกใช้ service เพื่ออัปเดตข้อมูล
      result = await ingredientService.update(id, request);
    } else {
      throw new Error("ID is required for edit mode.");
    }
    console.log(result, 'result onSubmit');

    if (result) {
      showSuccessAlert();
      onConfirm(result);
    }

  };

  const handleSaveDataClick = async (data: RawMaterialFormValues) => {
    const resultConfirm = await showConfirmation();
    if (resultConfirm.isConfirmed) {
      onSubmit(data);
    } else if (resultConfirm.isDismissed) {
      console.log('ถูกยกเลิก');
    }
  }

  const titles: Record<Mode, string> = {
    [ModeTypes.create]: t('master.rmCreate'),
    [ModeTypes.edit]: t('master.rmEdit'),
    [ModeTypes.view]: t('master.rmDetail'),
  };


  return (
    <ModalFrame
      title={titles[mode]}
      size={size}
      footer={
        <>
          <Button color="gray" onClick={() => { onClose({ isCancellation: !isViewMode }); }} disabled={isSubmitting}>
            {t('button.close')}
          </Button>
          {!isViewMode && (
            <Button color="success" form="food-group-form" isProcessing={isSubmitting} onClick={handleSubmit(handleSaveDataClick)}>
              {t('button.saveData')}
            </Button>
          )}
        </>
      }
    >

      <form id="raw-material-form" className="space-y-6" noValidate>

        {/* --- Section 1: ข้อมูลทั่วไป --- */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">ข้อมูลทั่วไป</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <div className="mb-2 block">
                <Label htmlFor="nameThai" value="ชื่อวัตถุดิบ (ไทย)" color={errors.nameThai && 'failure'} />
              </div>
              <TextInput
                id="nameThai"
                {...register("nameThai")}
                sizing="md"
                className={`form-control form-rounded-xl ${errors.nameThai && 'has-error'}`}
                disabled={isSubmitting || isViewMode}
              />
              {errors.nameThai && <HelperText color="failure" className="text-end">{errors.nameThai.message}</HelperText>}
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="nameEng" value="ชื่อวัตถุดิบ (อังกฤษ)" color={errors.nameEng && 'failure'} />
              </div>
              <TextInput
                id="nameEng"
                {...register("nameEng")}
                sizing="md"
                className={`form-control form-rounded-xl ${errors.nameEng && 'has-error'}`}
                disabled={isSubmitting || isViewMode}
              />
              {errors.nameEng && <HelperText color="failure" className="text-end">{errors.nameEng.message}</HelperText>}
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="foodId" value="Food ID" color={errors.foodId && 'failure'} />
              </div>
              <TextInput
                id="foodId"
                {...register("foodId")}
                sizing="md"
                className={`form-control form-rounded-xl ${errors.foodId && 'has-error'}`}
                disabled={isSubmitting || isViewMode}
              />
              {errors.foodId && <HelperText color="failure" className="text-end">{errors.foodId.message}</HelperText>}
            </div>

            <Controller
              name="groupId"
              control={control}
              render={({ field: controllerField }) => (
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="groupId" value="กลุ่ม (Group)" color={errors.groupId && 'failure'} />
                  </div>
                  <Select id="groupId" {...controllerField} sizing="md" className={`form-control form-rounded-xl ${errors.groupId && 'has-error'}`} disabled={isViewMode}>
                    <option value="">-- เลือกกลุ่ม --</option>
                    {ingredientGroupItems.length > 0 && ingredientGroupItems.map((row) => (
                      <option key={row.id} value={row.id}>{row.name}</option>
                    ))}
                  </Select>
                  {errors.groupId && <HelperText color="failure" className="text-end">{errors.groupId.message}</HelperText>}
                </div>
              )}
            />
          </div>
        </div>

        {/* --- Section 2: โภชนาการ --- */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">โภชนาการ (ต่อ 100 กรัม/มล.)</h3>
            {!isViewMode && (
              <div className="flex gap-2">
                {/* --- ปุ่มเพิ่มทั้งหมด (ปุ่มใหม่) --- */}
                <Button 
                  type="button" 
                  size="sm" 
                  color="light" // ใช้สีที่ดูรองลงมา
                  onClick={handleAddAllNutrients}
                >
                  <Icon icon="mdi:playlist-plus" className="mr-2" />
                  เพิ่มทั้งหมด
                </Button>

                {/* --- ปุ่มเพิ่มทีละรายการ (ปุ่มเดิม) --- */}
                <Button 
                  ref={addNutrientButtonRef} 
                  type="button" 
                  size="sm" 
                  color="cyan" 
                  onClick={handleAddNutrient}
                >
                  <Icon icon="mdi:plus" className="mr-2" />
                  เพิ่มสารอาหาร
                </Button>
              </div>
            )}
          </div>

          {/* Header ของตารางสารอาหาร */}
          <div className="grid grid-cols-12 gap-2 mb-2 px-2 text-sm font-medium text-gray-500">
            <div className="col-span-5">ชื่อสารอาหาร</div>
            <div className="col-span-3">หน่วย</div>
            <div className="col-span-3">ค่าสารอาหาร</div>
            <div className="col-span-1"></div>
          </div>

          {/* รายการสารอาหารแบบไดนามิก */}
          <div className="overflow-y-auto max-h-[30vh] space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-start py-1 px-1">

                {/* --- ชื่อสารอาหาร (Dropdown) --- */}
                <div className="col-span-5">
                  <Controller
                    name={`nutritions.${index}.nutritionId`}
                    control={control}
                    render={({ field: controllerField, fieldState }) => (
                      <>
                        <Select id={`nutritions.${index}.nutritionId`} 
                          {...controllerField} 
                          onChange={(e) => {
                            controllerField.onChange(e); // เรียก onChange เดิมของ RHF
                            handleNutritionChange(e, index); // เรียก handler ของเรา
                          }}
                          sizing="md" 
                          className={`form-control form-rounded-xl ${fieldState.error && 'has-error'}`} disabled={isViewMode}>
                          <option value="">-- เลือกสารอาหาร --</option>
                          {nutritionItems.length > 0 && nutritionItems.map((row) => (
                            <option key={row.id} value={row.id}>{row.name}</option>
                          ))}
                        </Select>
                        {fieldState.error && <HelperText color="failure" className="text-end">{fieldState.error.message}</HelperText>}
                      </>
                    )}
                  />
                </div>

                {/* --- หน่วย (Dropdown) --- */}
                <div className="col-span-3">
                  <Controller
                    name={`nutritions.${index}.unitId`}
                    control={control}
                    render={({ field: controllerField, fieldState }) => (
                      <>
                        <Select id={`nutritions.${index}.unitId`} {...controllerField} sizing="md" className={`form-control form-rounded-xl ${fieldState.error && 'has-error'}`} disabled={isViewMode}>
                          <option value="">-- เลือกหน่วย --</option>
                          {unitItems.length > 0 && unitItems.map((row) => (
                            <option key={row.id} value={row.id}>{row.name}</option>
                          ))}
                        </Select>
                        {fieldState.error && <HelperText color="failure" className="text-end">{fieldState.error.message}</HelperText>}
                      </>
                    )}
                  />
                </div>

                {/* --- ค่าสารอาหาร (Input) --- */}
                <div className="col-span-3">
                  <TextInput
                    type="text"
                    inputMode="decimal"
                    id={`nutritions.${index}.value`}
                    {...register(`nutritions.${index}.value`)}
                    sizing="md"
                    className={`form-control form-rounded-xl ${errors.nutritions?.[index]?.value && 'has-error'}`}
                    disabled={isSubmitting || isViewMode}
                    color={errors.nutritions?.[index]?.value && 'failure'}
                  />
                  {errors.nutritions?.[index]?.value && <HelperText color="failure" className="text-end">{errors.nutritions[index]?.value?.message}</HelperText>}
                </div>

                {/* --- ปุ่มลบ --- */}
                <div className="col-span-1 flex items-center h-full">
                  {!isViewMode && (
                    <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 p-2">
                      <Icon icon="mdi:delete-outline" width="20" />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </form>
    </ModalFrame>
  );
}