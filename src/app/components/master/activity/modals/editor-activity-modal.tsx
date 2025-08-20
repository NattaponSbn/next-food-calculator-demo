"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { number, z } from 'zod';
import { Button, HelperText, Label, Select, Textarea, TextInput, ToggleSwitch } from 'flowbite-react';
import { InjectedModalProps } from '@/app/core/hooks/use-modal';
import { ModalFrame, ModalSize } from '@/app/components/shared/modals/modal-frame';
import { useTranslation } from 'react-i18next';
import { showConfirmation, showSuccessAlert } from '@/app/lib/swal';
import { ModeTypes } from '@/app/core/models/const/type.const';
import { SuccessResponse } from '@/app/core/models/shared/common.model';
import { MasterActivityRequestItemModel, MasterActivityRequestModel } from '@/app/core/models/master/activity/activity.model';
import { activityService } from '@/app/core/services/master/activity.service';

// --- 1. Schema & Types (ปรับให้เป็นของ Unit) ---
const activitySchemaDefinition = (t: (key: string) => string) => z.object({
  code: z.string().min(1, { message: t('require.pleaseInput') }),
  nameEng: z.string().min(1, { message: t('require.pleaseInput') }),
  nameThai: z.string().min(1, { message: t('require.pleaseInput') }),
  description: z.string(),
  factorUp: z.number().min(1, { message: t('require.pleaseInput') }),
});
export type Mode = typeof ModeTypes[keyof typeof ModeTypes];

export interface ActivitysModalProps {
  mode: Mode;
  id?: number;
  size?: ModalSize;
}
export type ActivityFormValues = z.infer<ReturnType<typeof activitySchemaDefinition>>;
type activityModalResult = MasterActivityRequestModel & { id: string };


// --- 3. The Modal Component (ปรับให้เป็น UnitModal) ---
export function ActivitysModal({
  mode,
  id,
  size,
  onConfirm,
  onClose,
}: ActivitysModalProps & InjectedModalProps<SuccessResponse>) {
  const { t } = useTranslation();
  const isViewMode = mode === 'view';
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Zod schema ที่ขึ้นอยู่กับ `t` function
  const unitSchema = useMemo(() => activitySchemaDefinition(t), [t]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      code: '',
      nameEng: '',
      nameThai: '',
      description: '',
      factorUp: 0,
    },
  });

  // Logic การดึงข้อมูลสำหรับ Edit/View Mode
  useEffect(() => {
    const loadData = async () => {
      if (mode !== 'create' && id) {
        setIsLoadingData(true);
        const data = await activityService.getById(id);
        // อัปเดตฟอร์มด้วยข้อมูลที่ได้จาก API
        reset({
          code: data.code,
          nameEng: data.nameEN,
          nameThai: data.name,
          description: data.description,
          factorUp: data.factorUp
        });
      } else {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [mode, id, reset]);

  // Logic การ Submit ฟอร์ม
  const onSubmit = async (data: ActivityFormValues) => {
    const request: MasterActivityRequestItemModel = new MasterActivityRequestItemModel;
    request.code = data.code;
    request.name = data.nameThai;
    request.nameEN = data.nameEng;
    request.description = data.description;
    request.factorUp = Number(data.factorUp);
    let result: SuccessResponse;
    if (mode === 'create') {
      // เรียกใช้ service เพื่อสร้างข้อมูล
      result = await activityService.create(request);
    } else if (id) {
      // เรียกใช้ service เพื่ออัปเดตข้อมูล
      result = await activityService.update(id, request);
    } else {
      throw new Error("ID is required for edit mode.");
    }
    if (result) {
      showSuccessAlert();
      onConfirm(result);
    }
  };

  const handleSaveDataClick = async (data: ActivityFormValues) => {
    const resultConfirm = await showConfirmation();
    if (resultConfirm.isConfirmed) {
      await onSubmit(data);
    }
  };

  const titles: Record<Mode, string> = {
    [ModeTypes.create]: t('master.atvyCreate'),
    [ModeTypes.edit]: t('master.atvyEdit'),
    [ModeTypes.view]: t('master.atvyDetail'),
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
      <form id="unit-form" className='space-y-6' noValidate>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
          <div className='col-span-1'>
            {/* Unit Code */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="code" value="รหัสหน่วย" color={errors.code && 'failure'} />
              </div>
              <TextInput id="code" {...register("code")} className={`form-control form-rounded-xl ${errors.code && 'has-error'}`} disabled={isSubmitting || isViewMode} color={errors.code ? 'failure' : 'gray'} />
              {errors.code && <HelperText color="failure">{errors.code.message}</HelperText>}
            </div>
          </div>
        </div>

        {/* Name (EN) */}
        <div >
          <div className="mb-2 block">
            <Label htmlFor="nameEng" value="ชื่อ (EN)" color={errors.nameEng && 'failure'} />
          </div>

          <TextInput id="nameEng" {...register("nameEng")} sizing="md" className={`form-control form-rounded-xl ${errors.nameEng && 'has-error'}`} disabled={isSubmitting || isViewMode} color={errors.nameEng ? 'failure' : 'gray'} />
          {errors.nameEng && <HelperText color="failure">{errors.nameEng.message}</HelperText>}
        </div>

        {/* Name (TH) */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="nameThai" value="ชื่อ (TH)" color={errors.nameThai && 'failure'} />
          </div>
          <TextInput id="nameThai" {...register("nameThai")} sizing="md" className={`form-control form-rounded-xl ${errors.nameThai && 'has-error'}`} disabled={isSubmitting || isViewMode} color={errors.nameThai ? 'failure' : 'gray'} />
          {errors.nameThai && <HelperText color="failure">{errors.nameThai.message}</HelperText>}
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-4" >
          <div className='col-span-1'>
            <div className="mb-2 block">
              <Label htmlFor="factorUp" value="ปัจจัยขึ้น" color={errors.factorUp && 'failure'} />
            </div>

            <TextInput id="factorUp" {...register("factorUp")} sizing="md" className={`form-control form-rounded-xl ${errors.factorUp && 'has-error'}`} disabled={isSubmitting || isViewMode} color={errors.factorUp ? 'failure' : 'gray'} />
            {errors.factorUp && <HelperText color="failure">{errors.factorUp.message}</HelperText>}
          </div>



          {/* Description */}
          <div className="md:col-span-2">
            <div className="mb-2 block">
              <Label htmlFor="description" value="คำอธิบาย" />
            </div>

            <Textarea id="description" {...register("description")} className={`form-control form-rounded-xl`} rows={3} disabled={isSubmitting || isViewMode} />
          </div>
        </div>



        {/* Status */}
        {/* <div className="md:col-span-2">
          <Controller name="status" control={control} render={({ field }) => (
            <ToggleSwitch
              label="สถานะ"
              checked={field.value}
              onChange={field.onChange}
              disabled={isSubmitting || isViewMode}
            />
          )} />
        </div> */}

      </form>
    </ModalFrame>
  );
}