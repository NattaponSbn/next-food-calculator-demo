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

// 2. Types
export type Mode = typeof ModeTypes[keyof typeof ModeTypes];
const _nutrientCategoriesSchema = z.object({
  code: z.string(),
  nameEng: z.string(),
  nameThai: z.string(),
});
export interface NutrientCategoriesModalProps {
  mode: Mode;
  id?: string;
  size?: ModalSize;
}
type NutrientCategoriesModalResult = NutrientCategoriesFormValues & { id: string };
export type NutrientCategoriesFormValues = z.infer<typeof _nutrientCategoriesSchema>;
// 3. Mock API
const saveNutrientCategoriesApi = (data: NutrientCategoriesFormValues, id?: string) =>
  new Promise<NutrientCategoriesModalResult>(res => setTimeout(() => res({ id: id || `nc_${Date.now()}`, ...data }), 1000));

// 4. The Modal Component
export function NutrientCategoriesModal({
  mode,
  id,
  size,
  onConfirm,
  onClose,
}: NutrientCategoriesModalProps & InjectedModalProps<NutrientCategoriesModalResult>) {
  const { t } = useTranslation();
  const isViewMode = mode === 'view';
  const [isLoadingData, setIsLoadingData] = useState(true);

  const nutrientCategoriesSchema = useMemo(() => z.object({
    code: z.string().min(3, { message: t('require.pleaseInput') }),
    nameEng: z.string().min(3, { message: t('require.pleaseInput') }),
    nameThai: z.string().min(3, { message: t('require.pleaseInput') }),
  }), [t]); // ใช้ useMemo เพื่อไม่ให้สร้าง Schema ใหม่ทุกครั้งที่ re-render

  const {
    register,
    handleSubmit,
    reset, // <-- เพิ่ม 'reset' เพื่ออัปเดตค่าในฟอร์ม
    formState: { errors, isSubmitting },
  } = useForm<NutrientCategoriesFormValues>({
    resolver: zodResolver(nutrientCategoriesSchema),
    // ค่าเริ่มต้นให้เป็นค่าว่างไปก่อน แล้วเราจะใช้ useEffect + reset มาใส่ทีหลัง
    defaultValues: { code: '', nameEng: '', nameThai: '' },
  });

  useEffect(() => {
    // ถ้าไม่ใช่โหมด 'create' และมี 'id' ส่งมา
    if (mode !== 'create' && id) {
      setIsLoadingData(true);

    } else {
      // ถ้าเป็นโหมด 'create' ไม่ต้องทำอะไร และถือว่าโหลดเสร็จแล้ว
      setIsLoadingData(false);
    }
  }, [mode, id, reset, onClose]);

  const onSubmit = async (data: NutrientCategoriesFormValues) => {
    try {
      const result = await saveNutrientCategoriesApi(data, id);
      showSuccessAlert();
      onConfirm(result); // สำเร็จ: ส่งข้อมูลกลับและปิด Modal
    } catch (error) {
      console.error('API Error:', error);
      onClose(); // ล้มเหลว: ปิด Modal
    }
  };

  const handleSaveDataClick = async (data: NutrientCategoriesFormValues) => {
    const resultConfirm = await showConfirmation();
    if (resultConfirm.isConfirmed) {
      onSubmit(data);
    } else if (resultConfirm.isDismissed) {
      console.log('ถูกยกเลิก');
    }
  }

  const titles: Record<Mode, string> = {
    [ModeTypes.create]: t('master.ncCreate'),
    [ModeTypes.edit]: t('master.ncEdit'),
    [ModeTypes.view]: t('master.ncDetail'),
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
        <div>
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
        <div>
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
      </form>
    </ModalFrame>
  );
}