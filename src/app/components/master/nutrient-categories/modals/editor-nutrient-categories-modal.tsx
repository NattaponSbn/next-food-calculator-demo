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
import { nutritionGroupService } from '@/app/core/services/master/nutrition-group.service';
import { SuccessResponse } from '@/app/core/models/shared/common.model';
import { MasterNutrientCategoriesRequestItemModel } from '@/app/core/models/master/nutrient-categories/nutrient-categories.model';

// 2. Types
export type Mode = typeof ModeTypes[keyof typeof ModeTypes];
const nutrientCategoriesSchemaDefinition = (t: (key: string) => string) => z.object({
  code: z.string().min(1, { message: t('require.pleaseInput') }),
  nameEng: z.string().min(1, { message: t('require.pleaseInput') }),
  nameThai: z.string().min(1, { message: t('require.pleaseInput') }),
});
export interface NutrientCategoriesModalProps {
  mode: Mode;
  id?: number;
  size?: ModalSize;
}
type NutrientCategoriesModalResult = NutrientCategoriesFormValues & { id: string };
export type NutrientCategoriesFormValues = z.infer<ReturnType<typeof nutrientCategoriesSchemaDefinition>>;

// 4. The Modal Component
export function NutrientCategoriesModal({
  mode,
  id,
  size,
  onConfirm,
  onClose,
}: NutrientCategoriesModalProps & InjectedModalProps<SuccessResponse>) {
  const { t } = useTranslation();
  const isViewMode = mode === 'view';
  const [isLoadingData, setIsLoadingData] = useState(true);

  const nutrientCategoriesSchema = useMemo(() => nutrientCategoriesSchemaDefinition(t), [t]);

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
    const loadData = async () => {
      if (mode !== 'create' && id) {
        setIsLoadingData(true);
        const data = await nutritionGroupService.getById(id);
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

  const onSubmit = async (data: NutrientCategoriesFormValues) => {
    const request: MasterNutrientCategoriesRequestItemModel = new MasterNutrientCategoriesRequestItemModel;
    request.code = data.code;
    request.name = data.nameThai;
    request.nameEN = data.nameEng;
    request.description = data.nameThai;
    let result: SuccessResponse;
    if (mode === 'create') {
      // เรียกใช้ service เพื่อสร้างข้อมูล
      result = await nutritionGroupService.create(request);
    } else if (id) {
      // เรียกใช้ service เพื่ออัปเดตข้อมูล
      result = await nutritionGroupService.update(id, request);
    } else {
      throw new Error("ID is required for edit mode.");
    }
    console.log(result, 'result onSubmit');

    if (result) {
      showSuccessAlert();
      onConfirm(result);
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