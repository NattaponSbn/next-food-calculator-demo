"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, HelperText, Label, Select, Textarea, TextInput, ToggleSwitch } from 'flowbite-react';
import { InjectedModalProps } from '@/app/core/hooks/use-modal';
import { ModalFrame, ModalSize } from '@/app/components/shared/modals/modal-frame';
import { useTranslation } from 'react-i18next';
import { showConfirmation, showSuccessAlert } from '@/app/lib/swal';
import { ModeTypes } from '@/app/core/models/const/type.const';
import { MasterUnitsRequestItemModel, MasterUnitsRequestModel } from '@/app/core/models/master/units/units.model';
import { unitsService } from '@/app/core/services/master/units.service';
import { SuccessResponse } from '@/app/core/models/shared/common.model';

// --- 1. Schema & Types (ปรับให้เป็นของ Unit) ---
const unitSchemaDefinition = (t: (key: string) => string) => z.object({
  unitCode: z.string().min(1, { message: t('require.pleaseInput') }),
  nameEng: z.string().min(1, { message: t('require.pleaseInput') }),
  nameThai: z.string().min(1, { message: t('require.pleaseInput') }),
  unitType: z.enum(['Weight', 'Energy', 'Volume', 'Other'], {
    errorMap: () => ({ message: t('require.pleaseSelect') })
  }),
  description: z.string().optional(),
  status: z.boolean(),
});
export type Mode = typeof ModeTypes[keyof typeof ModeTypes];

export interface UnitsModalProps {
  mode: Mode;
  id?: number;
  size?: ModalSize;
}
export type UnitFormValues = z.infer<ReturnType<typeof unitSchemaDefinition>>;
type UnitModalResult = MasterUnitsRequestModel & { id: string };


// --- 3. The Modal Component (ปรับให้เป็น UnitModal) ---
export function UnitsModal({
  mode,
  id,
  size,
  onConfirm,
  onClose,
}: UnitsModalProps & InjectedModalProps<SuccessResponse>) {
  const { t } = useTranslation();
  const isViewMode = mode === 'view';
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Zod schema ที่ขึ้นอยู่กับ `t` function
  const unitSchema = useMemo(() => unitSchemaDefinition(t), [t]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      unitCode: '',
      nameEng: '',
      nameThai: '',
      unitType: 'Weight',
      description: '',
      status: true,
    },
  });

  // Logic การดึงข้อมูลสำหรับ Edit/View Mode
  useEffect(() => {
  const loadData = async () => {
       if (mode !== 'create' && id) {
         setIsLoadingData(true);
         const data = await unitsService.getById(id);
         // อัปเดตฟอร์มด้วยข้อมูลที่ได้จาก API
         reset({
           unitCode: data.code,
           nameEng: data.nameEN,
           nameThai: data.name,
         });
       } else {
         setIsLoadingData(false);
       }
     };
 
     loadData();
  }, [mode, id, reset]);

  // Logic การ Submit ฟอร์ม
  const onSubmit = async (data: UnitFormValues) => {
    const request: MasterUnitsRequestItemModel = new MasterUnitsRequestItemModel;
     request.code = data.unitCode;
     request.name = data.nameThai;
     request.nameEN = data.nameEng;
     request.description = data.nameThai;
     let result: SuccessResponse;
     if (mode === 'create') {
       // เรียกใช้ service เพื่อสร้างข้อมูล
       result = await unitsService.create(request);
     } else if (id) {
       // เรียกใช้ service เพื่ออัปเดตข้อมูล
       result = await unitsService.update(id, request);
     } else {
       throw new Error("ID is required for edit mode.");
     }
     if (result) {
       showSuccessAlert();
       onConfirm(result);
     }
  };

  const handleSaveDataClick = async (data: UnitFormValues) => {
    const resultConfirm = await showConfirmation();
    if (resultConfirm.isConfirmed) {
      await onSubmit(data);
    }
  };

  const titles: Record<Mode, string> = {
    [ModeTypes.create]: t('master.unCreate'),
    [ModeTypes.edit]: t('master.unEdit'),
    [ModeTypes.view]: t('master.unDetail'),
  };

  // --- JSX Layout ---
  return (
    <ModalFrame
      title={titles[mode]}
      size={size}
      footer={
        <>
          <Button color="gray" onClick={() => onClose()} disabled={isSubmitting}>
            {isViewMode ? t('button.close') : t('button.cancel')}
          </Button>
          {!isViewMode && (
            <Button color="blue" isProcessing={isSubmitting} onClick={handleSubmit(handleSaveDataClick)}>
              {t('button.saveData')}
            </Button>
          )}
        </>
      }
    >
      <form id="unit-form" className="grid grid-cols-1 md:grid-cols-2 gap-4" noValidate>
        {/* Unit Code */}
        <div>
          <Label htmlFor="unitCode" value="รหัสหน่วย" color={errors.unitCode && 'failure'} />
          <TextInput id="unitCode" {...register("unitCode")}  className={`form-control form-rounded-xl ${errors.unitCode && 'has-error'}`} disabled={isSubmitting || isViewMode} color={errors.unitCode ? 'failure' : 'gray'} />
          {errors.unitCode && <HelperText color="failure">{errors.unitCode.message}</HelperText>}
        </div>

        {/* Unit Type */}
        <Controller name="unitType" control={control} render={({ field }) => (
          <div>
            <Label htmlFor="unitType" value="ประเภทหน่วย" color={errors.unitType && 'failure'} />
            <Select id="unitType" {...field} sizing="md" className={`form-control form-rounded-xl ${errors.unitType && 'has-error'}`} disabled={isSubmitting || isViewMode} color={errors.unitType ? 'failure' : 'gray'}>
              <option value="Weight">Weight</option>
              <option value="Energy">Energy</option>
              <option value="Volume">Volume</option>
              <option value="Other">Other</option>
            </Select>
            {errors.unitType && <HelperText color="failure">{errors.unitType.message}</HelperText>}
          </div>
        )} />

        {/* Name (EN) */}
        <div>
          <Label htmlFor="nameEng" value="ชื่อ (EN)" color={errors.nameEng && 'failure'} />
          <TextInput id="nameEng" {...register("nameEng")} sizing="md" className={`form-control form-rounded-xl ${errors.nameEng && 'has-error'}`} disabled={isSubmitting || isViewMode} color={errors.nameEng ? 'failure' : 'gray'} />
          {errors.nameEng && <HelperText color="failure">{errors.nameEng.message}</HelperText>}
        </div>

        {/* Name (TH) */}
        <div>
          <Label htmlFor="nameThai" value="ชื่อ (TH)" color={errors.nameThai && 'failure'} />
          <TextInput id="nameThai" {...register("nameThai")} sizing="md" className={`form-control form-rounded-xl ${errors.nameThai && 'has-error'}`} disabled={isSubmitting || isViewMode} color={errors.nameThai ? 'failure' : 'gray'} />
          {errors.nameThai && <HelperText color="failure">{errors.nameThai.message}</HelperText>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description" value="คำอธิบาย" />
          <Textarea id="description" {...register("description")} className={`form-control form-rounded-xl`} rows={3} disabled={isSubmitting || isViewMode} />
        </div>

        {/* Status */}
        <div className="md:col-span-2">
          <Controller name="status" control={control} render={({ field }) => (
            <ToggleSwitch
              label="สถานะ"
              checked={field.value}
              onChange={field.onChange}
              disabled={isSubmitting || isViewMode}
            />
          )} />
        </div>

      </form>
    </ModalFrame>
  );
}