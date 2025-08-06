// components/BmrInputForm.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, Label, Radio, Select, TextInput } from 'flowbite-react';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { activityService } from '@/app/core/services/master/activity.service';
import { ActivityCommonModel } from '@/app/core/models/shared/common.model';
import { MasterActivityResponseItemModel } from '@/app/core/models/master/activity/activity.model';
import { GenderType, ModeTypes } from '@/app/core/models/const/type.const';

export type Mode = typeof ModeTypes[keyof typeof ModeTypes];
const genderType = GenderType;

const bmrCalculatorSchemaDefinition = (t: (key: string) => string) => z.object({
  name: z.string(),
  gender: z.coerce.number().min(1, "เลือกเพศ"),
  age: z.coerce.number().min(1, "อายุต้องมากกว่า 0").max(120, "อายุไม่ควรเกิน 120"),
  height: z.coerce.number().min(50, "ส่วนสูงต้องมากกว่า 50 ซม.").max(300, "ส่วนสูงไม่ควรเกิน 300 ซม."),
  weight: z.coerce.number().min(10, "น้ำหนักต้องมากกว่า 10 กก.").max(500, "น้ำหนักไม่ควรเกิน 500 กก."),
  activityLevelId: z.coerce.number().min(1, "กรุณาเลือกระดับกิจกรรม"),
  factorUp: z.number(),
  formula: z.string(),
});

export type BmrCalculatorFormValues = z.infer<ReturnType<typeof bmrCalculatorSchemaDefinition>>;

interface BmrInputFormProps {
  onCalculate: (data: BmrCalculatorFormValues) => void;
  initialData?: Partial<BmrCalculatorFormValues>;
  isViewMode: boolean;
}

export const BmrInputForm = ({ onCalculate, initialData, isViewMode }: BmrInputFormProps) => {
  const { t } = useTranslation();

  const [activityItems, setActivityItems] = useState<ActivityCommonModel[]>([]);

  const bmrCalculatorSchema = useMemo(() => bmrCalculatorSchemaDefinition(t), [t]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<BmrCalculatorFormValues>({
    resolver: zodResolver(bmrCalculatorSchema),
    defaultValues: {
      name: '',
      gender: genderType.male,
      activityLevelId: 0,
      formula: 'Revised Harris-Benedict',
    },
  });

  const genderOptions = [
    { id: genderType.male, label: t('ชาย') },
    { id: genderType.female, label: t('หญิง') },
  ];

  useEffect(() => {
    const loadAllInitialData = async () => {
      const [activityListData] = await Promise.all([
        activityService.getAll(),
      ]);
      setActivityItems(activityListData.items);
    };

    loadAllInitialData();
  }, []);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);


  const watchedActivityLevelId = watch('activityLevelId');

  useEffect(() => {
    const selectedActivity = activityItems.find(item => item.id === Number(watchedActivityLevelId));

    if (selectedActivity) {
      setValue('factorUp', selectedActivity.factorUp, { shouldValidate: true });
    }
  }, [watchedActivityLevelId, setValue]);

  const handleFormSubmit = handleSubmit(onCalculate);

  return (
    <div className="panel h-full">
      <div className="panel-header">
        <h2 className="panel-title">{t('calculator_bmr.personal_information')}</h2>
      </div>
      <div className="panel-body space-y-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value={t('system.name')} className="mb-2 block font-semibold" color={errors.name && 'failure'} />
          </div>
          <TextInput
            id="name"
            {...register("name")}
            placeholder={t('system.name')}
            className={`form-control form-rounded-xl ${errors.name && 'has-error'}`}
            required
            disabled={isViewMode}
          />
        </div>
        <div className='grid grid-cols-2 lg:grid-cols-2 gap-2'>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="gender" value={t('system.gender')} className="mb-2 block font-semibold" color={errors.gender && 'failure'} />
            </div>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-4">
                  {genderOptions.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Radio
                        id={`gender-${option.id}`} // id ต้องไม่ซ้ำกัน
                        name={field.name} // ใช้ชื่อจาก field เพื่อให้เป็นกลุ่มเดียวกัน
                        value={option.id}
                        checked={field.value === option.id} // เช็คว่าค่าในฟอร์มตรงกับ option นี้หรือไม่
                        onChange={() => field.onChange(option.id)} // เมื่อเปลี่ยน ให้อัปเดตค่าในฟอร์ม
                        disabled={isViewMode}
                        color={errors.gender ? 'failure' : 'primary'} // หรือสี default
                      />
                      <Label htmlFor={`gender-${option.id}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.gender && <HelperText color="failure" className="text-end">{errors.gender.message}</HelperText>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="age" value={t('system.age')} className="mb-2 block font-semibold" color={errors.age && 'failure'} />
            </div>
            <TextInput
              id="age"
              {...register("age")}
              placeholder={t('system.age')}
              className={`form-control form-rounded-xl ${errors.age && 'has-error'}`}
              required
              disabled={isViewMode}
            />
            {errors.age && <HelperText color="failure" className="text-end">{errors.age.message}</HelperText>}
          </div>
        </div>
        <div className='grid grid-cols-2 lg:grid-cols-2 gap-2'>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="height" value={t('system.height') + '(' + t('system.unit_cm') + ')'} className="mb-2 block font-semibold" color={errors.height && 'failure'} />
            </div>
            <TextInput
              id="height"
              {...register("height")}
              placeholder={t('system.height') + '(' + t('system.unit_cm') + ')'}
              className={`form-control form-rounded-xl ${errors.height && 'has-error'}`}
              required
              disabled={isViewMode}
            />
            {errors.height && <HelperText color="failure" className="text-end">{errors.height.message}</HelperText>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="weight" value={t('system.weight') + '(' + t('system.unit_kg') + ')'} className="mb-2 block font-semibold" color={errors.weight && 'failure'} />
            </div>
            <TextInput
              id="weight"
              {...register("weight")}
              placeholder={t('system.weight') + '(' + t('system.unit_kg') + ')'}
              className={`form-control form-rounded-xl ${errors.weight && 'has-error'}`}
              required
              disabled={isViewMode}
            />
            {errors.weight && <HelperText color="failure" className="text-end">{errors.weight.message}</HelperText>}
          </div>
        </div>
        <Controller
          name="activityLevelId"
          control={control}
          render={({ field: controllerField }) => (
            <div>
              <div className="mb-2 block">
                <Label htmlFor="activityLevelId" value={t('system.activity')} color={errors.activityLevelId && 'failure'} />
              </div>
              <Select id="activityLevelId" {...controllerField} sizing="md" className={`form-control form-rounded-xl ${errors.activityLevelId && 'has-error'}`} disabled={isViewMode}>
                <option value="">-- {t('system.select_activity')} --</option>
                {activityItems.length > 0 && activityItems.map((row) => (
                  <option key={row.id} value={row.id}>{row.name}</option>
                ))}
              </Select>
              {errors.activityLevelId && <HelperText color="failure" className="text-end">{errors.activityLevelId.message}</HelperText>}
            </div>
          )}
        />

        <div className="mb-2 block">
          <Label htmlFor="formula" value={t('system.calculator_formula')} color={errors.formula && 'failure'} />
        </div>
        <TextInput
          id="formula"
          {...register("formula")}
          placeholder={t('system.calculator_formula')}
          className={`form-control form-rounded-xl ${errors.formula && 'has-error'}`}
          required
          disabled={true}
        />
      </div>
      {
        !isViewMode && (
          <div className='flex items-center justify-center py-5'>
            <Button color="blue" onClick={handleFormSubmit} className='btn'>
              {t('button.calculator')}
            </Button>
          </div>
        )
      }

    </div>
  );
};

export default BmrInputForm;