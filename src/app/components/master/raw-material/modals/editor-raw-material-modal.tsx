import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, HelperText, Label, TextInput } from 'flowbite-react';
import { InjectedModalProps } from '@/app/core/hooks/use-modal';
import { ModalFrame, ModalSize } from '@/app/components/shared/modals/modal-frame';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showConfirmation, showSuccessAlert } from '@/app/lib/swal';
import { ModeTypes } from '@/app/core/models/const/type.const';
import { SuccessResponse } from '@/app/core/models/shared/common.model';
import { MasterRawMaterialRequestItemModel } from '@/app/core/models/master/raw-material/raw-material.model';
import { nutritionService } from '@/app/core/services/master/nutrition.service';

// 2. Types
export type Mode = typeof ModeTypes[keyof typeof ModeTypes];
const rawMaterialSchemaDefinition = (t: (key: string) => string) => z.object({
  code: z.string().min(1, { message: t('require.pleaseInput') }),
  nameEng: z.string().min(1, { message: t('require.pleaseInput') }),
  nameThai: z.string().min(1, { message: t('require.pleaseInput') }),
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

  const rawMaterialSchema = useMemo(() => rawMaterialSchemaDefinition(t), [t]);

  const {
    register,
    handleSubmit,
    reset, // <-- เพิ่ม 'reset' เพื่ออัปเดตค่าในฟอร์ม
    formState: { errors, isSubmitting },
  } = useForm<RawMaterialFormValues>({
    resolver: zodResolver(rawMaterialSchema),
    // ค่าเริ่มต้นให้เป็นค่าว่างไปก่อน แล้วเราจะใช้ useEffect + reset มาใส่ทีหลัง
    defaultValues: { code: '', nameEng: '', nameThai: '' },
  });

  useEffect(() => {
    const loadData = async () => {
      if (mode !== 'create' && id) {
        setIsLoadingData(true);
        const data = await nutritionService.getById(id);
        // อัปเดตฟอร์มด้วยข้อมูลที่ได้จาก API
        reset({
          code: data.code,
          nameEng: data.nameEN,
          nameThai: data.name,
        });
      } else {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [mode, id, reset, onClose]);

  const onSubmit = async (data: RawMaterialFormValues) => {
    const request: MasterRawMaterialRequestItemModel = new MasterRawMaterialRequestItemModel;
    request.code = data.code;
    request.name = data.nameThai;
    request.nameEN = data.nameEng;
    request.description = data.nameThai;
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
      <form id="food-group-form" className="space-y-4" noValidate>
        {/* code Field */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="code" value={t('master.rmCode')} className='text-dark' color={errors.code && 'failure'} />
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
        <div>
          <div className="mb-2 block">
            <Label htmlFor="nameEng" value={t('master.rmName') + ' (' + t('system.language.en') + ')'} className='text-dark' color={errors.nameEng && 'failure'} />
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
        <div>
          <div className="mb-2 block">
            <Label htmlFor="nameThai" value={t('master.rmName') + ' (' + t('system.language.th') + ')'} className='text-dark' color={errors.nameThai && 'failure'} />
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
      </form>
    </ModalFrame>
  );
}