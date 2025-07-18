import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, HelperText, Label, Select, Textarea, TextInput, ToggleSwitch } from 'flowbite-react';
import { InjectedModalProps } from '@/app/core/hooks/use-modal';
import { ModalFrame, ModalSize } from '@/app/components/shared/modals/modal-frame';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showConfirmation, showSuccessAlert } from '@/app/lib/swal';
import { ModeTypes } from '@/app/core/models/const/type.const';
import { nutritionService } from '@/app/core/services/master/nutrition.service';
import { MasterNutrientRequestItemModel } from '@/app/core/models/master/nutrients/nutrient.model';
import { NutritionGroupCommonModel, SuccessResponse, UnitCommonModel } from '@/app/core/models/shared/common.model';
import { unitsService } from '@/app/core/services/master/units.service';
import { nutritionGroupService } from '@/app/core/services/master/nutrition-group.service';

// 2. Types
export type Mode = typeof ModeTypes[keyof typeof ModeTypes];
const nutrientSchemaDefinition = (t: (key: string) => string) => z.object({
  code: z.string().min(1, { message: t('require.pleaseInput') }),
  nameEng: z.string().min(1, { message: t('require.pleaseInput') }),
  nameThai: z.string().min(1, { message: t('require.pleaseInput') }),
  description: z.string(),
  ncId: z.coerce.number({ required_error: t('require.pleaseSelect') })
    .min(1, { message: t('require.pleaseSelect') }),
  unitId: z.coerce.number({ required_error: t('require.pleaseSelect') })
    .min(1, { message: t('require.pleaseSelect') }),
  isRequire: z.boolean()
});
export interface NutrientModalProps {
  mode: Mode;
  id?: number;
  size?: ModalSize;
}
type NutrientModalResult = NutrientFormValues & { id: string };
export type NutrientFormValues = z.infer<ReturnType<typeof nutrientSchemaDefinition>>;

// 4. The Modal Component
export function NutrientModal({
  mode,
  id,
  size,
  onConfirm,
  onClose,
}: NutrientModalProps & InjectedModalProps<SuccessResponse>) {
  const { t } = useTranslation();
  const isViewMode = mode === 'view';
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [nutritionGroupItems, setNutritionGroupItems] = useState<NutritionGroupCommonModel[]>([]);
  const [unitItems, setUnitItems] = useState<UnitCommonModel[]>([]);

  const nutrientSchema = useMemo(() => nutrientSchemaDefinition(t), [t]);

  const {
    control,
    register,
    handleSubmit,
    reset, // <-- เพิ่ม 'reset' เพื่ออัปเดตค่าในฟอร์ม
    formState: { errors, isSubmitting },
  } = useForm<NutrientFormValues>({
    resolver: zodResolver(nutrientSchema),
    // ค่าเริ่มต้นให้เป็นค่าว่างไปก่อน แล้วเราจะใช้ useEffect + reset มาใส่ทีหลัง
    defaultValues: { code: '', nameEng: '', nameThai: '', description: '', ncId: 0, unitId: 0, isRequire: false },
  });

  useEffect(() => {
    const loadAllInitialData = async () => {
      setIsLoadingData(true);
      try {
        // 1. ยิง API เพื่อดึงข้อมูลสำหรับ Dropdown ทั้งหมดพร้อมกัน
        const [nutritionListData, unitData] = await Promise.all([
          nutritionGroupService.getAll(),
          unitsService.getAll()
        ]);

        // 2. อัปเดต State ของ Dropdown ทั้งหมด
        setNutritionGroupItems(nutritionListData.items);
        setUnitItems(unitData.items);

        // 3. ตรวจสอบว่าเป็นโหมด Edit/View หรือไม่
        if ((mode === 'edit' || mode === 'view') && id) {
          // ถ้าใช่, ให้ดึงข้อมูลของรายการนั้นๆ ต่อ
          const data = await nutritionService.getById(id); // หรือ nutritionService ตามที่คุณใช้

           reset({
            code: data.code,
            nameEng: data.nameEN,
            nameThai: data.name,
            description: data.description,

            ncId: data.groupId || 0,
            unitId: data.primaryUnitId || 0,
            isRequire: data.isRequire,
          });

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

  const onSubmit = async (data: NutrientFormValues) => {
      const request: MasterNutrientRequestItemModel = new MasterNutrientRequestItemModel;
       request.code = data.code;
       request.name = data.nameThai;
       request.nameEN = data.nameEng;
       request.description = data.description;
       request.groupId = data.ncId;
       request.primaryUnitId = data.unitId;
       request.isRequire = data.isRequire;
       let result: SuccessResponse;
       if (mode === 'create') {
         // เรียกใช้ service เพื่อสร้างข้อมูล
         result = await nutritionService.create(request);
       } else if (id) {
         // เรียกใช้ service เพื่ออัปเดตข้อมูล
         result = await nutritionService.update(id, request);
       } else {
         throw new Error("ID is required for edit mode.");
       }
       console.log(result, 'result onSubmit');
   
       if (result) {
         showSuccessAlert();
         onConfirm(result);
       }
  };

  const handleSaveDataClick = async (data: NutrientFormValues) => {
    const resultConfirm = await showConfirmation();
    if (resultConfirm.isConfirmed) {
      onSubmit(data);
    } else if (resultConfirm.isDismissed) {
      console.log('ถูกยกเลิก');
    }
  }

  const titles: Record<Mode, string> = {
    [ModeTypes.create]: t('master.nCreate'),
    [ModeTypes.edit]: t('master.nEdit'),
    [ModeTypes.view]: t('master.nDetail'),
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
      <form id="food-group-form" className="space-y-4" noValidate>
        <div className="grid grid-cols-5 md:grid-cols-5 gap-2">
          {/* code Field */}
          <div className="col-span-1">
            <div className="mb-2 block">
              <Label htmlFor="code" value={t('master.ncCode')} className='text-dark' color={errors.code && 'failure'} />
            </div>
            <TextInput
              id="code"
              {...register("code")}
              sizing="md"
              className={`form-control form-rounded-xl ${errors.code && 'has-error'}`}
              disabled={isSubmitting || isViewMode}
            />
            {errors.code && <HelperText color="failure" className="text-end">{errors.code.message}</HelperText>}
          </div>

          {/* nameEng Field */}
          <div className="col-span-2">
            <div className="mb-2 block">
              <Label htmlFor="nameEng" value={t('master.ncName') + ' (' + t('system.language.en') + ')'} className='text-dark' color={errors.nameEng && 'failure'} />
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

          {/* nameThai Field */}
          <div className="col-span-2">
            <div className="mb-2 block">
              <Label htmlFor="nameThai" value={t('master.ncName') + ' (' + t('system.language.th') + ')'} className='text-dark' color={errors.nameThai && 'failure'} />
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
        </div>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
          <div>
             <Controller
              name="ncId"
              control={control}
              render={({ field: controllerField }) => (
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="ncId" value="กลุ่ม (Group)" color={errors.ncId && 'failure'} />
                  </div>
                  <Select id="ncId" {...controllerField} sizing="md" className={`form-control form-rounded-xl ${errors.ncId && 'has-error'}`} disabled={isViewMode}>
                    <option value="">-- เลือกกลุ่ม --</option>
                    {nutritionGroupItems.length > 0 && nutritionGroupItems.map((row) => (
                      <option key={row.id} value={row.id}>{row.name}</option>
                    ))}
                  </Select>
                  {errors.ncId && <HelperText color="failure" className="text-end">{errors.ncId.message}</HelperText>}
                </div>
              )}
            />
          </div>
          <div>
             <Controller
              name="unitId"
              control={control}
              render={({ field: controllerField }) => (
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="unitId" value="Unit" color={errors.unitId && 'failure'} />
                  </div>
                  <Select id="unitId" {...controllerField} sizing="md" className={`form-control form-rounded-xl ${errors.unitId && 'has-error'}`} disabled={isViewMode}>
                    <option value="">-- เลือกกลุ่ม --</option>
                    {unitItems.length > 0 && unitItems.map((row) => (
                      <option key={row.id} value={row.id}>{row.name}</option>
                    ))}
                  </Select>
                  {errors.unitId && <HelperText color="failure" className="text-end">{errors.unitId.message}</HelperText>}
                </div>
              )}
            />
          </div>
          <div className='flex items-center'>
            <Controller name="isRequire" control={control} render={({ field }) => (
                <ToggleSwitch
                  label="ไม่อนุญาติให้แก้ไข unit"
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting || isViewMode}
                />
              )} />
          </div>
        </div>
      </form>
    </ModalFrame>
  );
}