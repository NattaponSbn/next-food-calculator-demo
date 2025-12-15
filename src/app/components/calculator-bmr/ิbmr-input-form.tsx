// components/BmrInputForm.tsx
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, HelperText, Label, Radio, TextInput } from 'flowbite-react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { Icon } from '@iconify/react';
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
              <Listbox value={controllerField.value} onChange={controllerField.onChange} disabled={isViewMode}>
                <div className="relative mt-1">
                  <ListboxButton className={`relative w-full cursor-pointer rounded-xl bg-white py-2.5 pl-4 pr-10 text-left border border-gray-200 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm ${errors.activityLevelId ? 'border-red-500 text-red-900' : ''} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}>
                    <span className="block truncate">
                      {activityItems.find((item) => item.id === Number(controllerField.value))?.name || `-- ${t('system.select_activity')} --`}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <Icon icon="heroicons:chevron-up-down-20-solid" className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  <Transition
                    as={React.Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50 dark:bg-gray-700">
                      <ListboxOption
                        key="default"
                        className={({ active }: { active: boolean }) =>
                          `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900 dark:text-gray-300'
                          }`
                        }
                        value=""
                      >
                        {({ selected }: { selected: boolean }) => (
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            -- {t('system.select_activity')} --
                          </span>
                        )}
                      </ListboxOption>
                      {activityItems.map((item) => (
                        <ListboxOption
                          key={item.id}
                          className={({ active }: { active: boolean }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'
                            }`
                          }
                          value={item.id}
                        >
                          {({ selected }: { selected: boolean }) => (
                            <>
                              <span
                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                  }`}
                              >
                                {item.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600 dark:text-primary-400">
                                  <Icon icon="heroicons:check-20-solid" className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </Listbox>
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