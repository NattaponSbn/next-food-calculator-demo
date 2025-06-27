import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, HelperText, Label, TextInput } from 'flowbite-react';
import { InjectedModalProps } from '@/app/core/hooks/use-modal';
import { ModalFrame, ModalSize } from '@/app/components/shared/modals/modal-frame';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showConfirmation, showSuccessAlert } from '@/app/lib/swal';



// 1. Validation Schema ด้วย Zod
const foodGroupSchema = z.object({
  code: z.string().min(3, { message: 'กรุณากรอกข้อมูล' }),
  nameEng: z.string().min(3, { message: 'กรุณากรอกข้อมูล' }),
  nameThai: z.string().min(3, { message: 'กรุณากรอกข้อมูล' }),
});

// 2. Types
type FoodGroupFormData = z.infer<typeof foodGroupSchema>;
export interface FoodGroupModalProps {
  mode: 'create' | 'edit' | 'view';
  id?: string;
  size?: ModalSize;
}
type FoodGroupModalResult = FoodGroupFormData & { id: string };

// 3. Mock API
const saveFoodGroupApi = (data: FoodGroupFormData, id?: string) =>
  new Promise<FoodGroupModalResult>(res => setTimeout(() => res({ id: id || `fg_${Date.now()}`, ...data }), 1000));

// 4. The Modal Component
export function FoodGroupModal({
  mode,
  id,
  size,
  onConfirm,
  onClose,
}: FoodGroupModalProps & InjectedModalProps<FoodGroupModalResult>) {
  
  const { t } = useTranslation();
  const isViewMode = mode === 'view';
  const [isLoadingData, setIsLoadingData] = useState(true);
  

   const {
    register,
    handleSubmit,
    reset, // <-- เพิ่ม 'reset' เพื่ออัปเดตค่าในฟอร์ม
    formState: { errors, isSubmitting },
  } = useForm<FoodGroupFormData>({
    resolver: zodResolver(foodGroupSchema),
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

  const onSubmit = async (data: FoodGroupFormData) => {
    try {
      const result = await saveFoodGroupApi(data, id);
      showSuccessAlert();
      onConfirm(result); // สำเร็จ: ส่งข้อมูลกลับและปิด Modal
    } catch (error) {
      console.error('API Error:', error);
      onClose(); // ล้มเหลว: ปิด Modal
    }
  };

   const handleSaveDataClick = async (data: FoodGroupFormData) => {
     const resultConfirm = await showConfirmation();
      if (resultConfirm.isConfirmed) {
       onSubmit(data);
      } else if (resultConfirm.isDismissed) {
        console.log('ถูกยกเลิก');
      }
  }

  const titles = { create: t('master.fgCreate'), edit: t('master.fgEdit'), view: t('master.fgDetail') };
 
  
  return (
    <ModalFrame
      title={titles[mode]}
      size={size}
      footer={
        <>
          <Button color="gray" onClick={onClose} disabled={isSubmitting}>
            { t('button.close') }
          </Button>
          {!isViewMode && (
            <Button color="success" form="food-group-form" isProcessing={isSubmitting} onClick={handleSubmit(handleSaveDataClick)}>
              { t('button.saveData') }
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