import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, Label, TextInput } from 'flowbite-react';
import { InjectedModalProps } from '@/app/core/hooks/use-modal';
import { ModalFrame, ModalSize } from '@/app/components/shared/modals/modal-frame';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showConfirmation, showSuccessAlert } from '@/app/lib/swal';
import { ModeTypes } from '@/app/core/models/const/type.const';
import * as z from 'zod';
import { SuccessResponse } from '@/app/core/models/shared/common.model';
import { MasterIngredientGroupRequestItemModel, MasterIngredientGroupResponseItemModel } from '@/app/core/models/master/ingredient-group/ingredient-group.mode';
import { ingredientGroupService } from '@/app/core/services/master/ingredient-group.service';


export type Mode = typeof ModeTypes[keyof typeof ModeTypes];
const foodGroupSchemaDefinition = (t: (key: string) => string) => z.object({
  code: z.string().min(1, { message: t('require.pleaseInput') }),
  nameEng: z.string().min(1, { message: t('require.pleaseInput') }),
  nameThai: z.string().min(1, { message: t('require.pleaseInput') }),
});

export type FoodGroupFormValues = z.infer<ReturnType<typeof foodGroupSchemaDefinition>>;
export interface FoodGroupModalProps {
  mode: Mode;
  id?: number;
  size?: ModalSize;
}
type FoodGroupModalResult = FoodGroupFormValues & { id: string };


// 4. The Modal Component
export function FoodGroupModal({
  mode,
  id,
  size,
  onConfirm,
  onClose,
}: FoodGroupModalProps & InjectedModalProps<SuccessResponse>) {
  const { t } = useTranslation();
  const isViewMode = mode === 'view';
  const [isLoadingData, setIsLoadingData] = useState(true);

  const foodGroupSchema = useMemo(() => foodGroupSchemaDefinition(t), [t]);

  const {
    register,
    handleSubmit,
    reset, // <-- เพิ่ม 'reset' เพื่ออัปเดตค่าในฟอร์ม
    formState: { errors, isSubmitting },
  } = useForm<FoodGroupFormValues>({
    resolver: zodResolver(foodGroupSchema),
    // ค่าเริ่มต้นให้เป็นค่าว่างไปก่อน แล้วเราจะใช้ useEffect + reset มาใส่ทีหลัง
    defaultValues: { code: '', nameEng: '', nameThai: '' },
  });

  useEffect(() => {
    const loadData = async () => {
      if (mode !== 'create' && id) {
        setIsLoadingData(true);
        const data = await ingredientGroupService.getById(id);
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

  const onSubmit = async (data: FoodGroupFormValues) => {
    const request: MasterIngredientGroupResponseItemModel = new MasterIngredientGroupResponseItemModel;
    request.code = data.code;
    request.name = data.nameThai;
    request.nameEN = data.nameEng;
    request.description = data.nameThai;
    let result: SuccessResponse;
    if (mode === 'create') {
      // เรียกใช้ service เพื่อสร้างข้อมูล
      result = await ingredientGroupService.create(request);
    } else if (id) {
      // เรียกใช้ service เพื่ออัปเดตข้อมูล
      result = await ingredientGroupService.update(id, request);
    } else {
      throw new Error("ID is required for edit mode.");
    }
    console.log(result, 'result onSubmit');

    if (result) {
      showSuccessAlert();
      onConfirm(result);
    }

  };

  const handleSaveDataClick = async (data: FoodGroupFormValues) => {
    const resultConfirm = await showConfirmation();
    if (resultConfirm.isConfirmed) {
      onSubmit(data);
    } else if (resultConfirm.isDismissed) {
      console.log('ถูกยกเลิก');
    }
  }

  const titles: Record<Mode, string> = {
    [ModeTypes.create]: t('master.fgCreate'),
    [ModeTypes.edit]: t('master.fgEdit'),
    [ModeTypes.view]: t('master.fgDetail'),
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
            <Label htmlFor="code" value={t('master.fgCode')} className='text-dark' color={errors.code && 'failure'} />
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
            <Label htmlFor="nameEng" value={t('master.fgName') + ' (' + t('system.language.en') + ')'} className='text-dark' color={errors.nameEng && 'failure'} />
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
            <Label htmlFor="nameThai" value={t('master.fgName') + ' (' + t('system.language.th') + ')'} className='text-dark' color={errors.nameThai && 'failure'} />
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