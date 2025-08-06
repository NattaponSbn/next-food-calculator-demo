'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModeTypes } from '@/app/core/models/const/type.const';
import { showConfirmation, showSuccessAlert, showWarningAlert } from '@/app/lib/swal';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import BmrInputForm, { BmrCalculatorFormValues } from './ิbmr-input-form';
import BmrResultDisplay from './bmr-result-display';
import { calculatorBMRService } from '@/app/core/services/calculator-bmr/cal-bmr.service';
import { CalculationBMRRequestModel, CalculatorBMRResponseItemModel } from '@/app/core/models/calculator-bmr/bmr.model';

export type Mode = typeof ModeTypes[keyof typeof ModeTypes];

const CalculatorBMRPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const mode: Mode = (searchParams.get('mode') as Mode) || '';
  const calculationId = Number(searchParams.get('id'));
  const isViewMode = mode === ModeTypes.view;

  const [isCalculating, setIsCalculating] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(mode !== 'create');
  const [tdeeResult, setTdeeResult] = useState<CalculatorBMRResponseItemModel | null>(null);
  const [initialFormValues, setInitialFormValues] = useState<Partial<BmrCalculatorFormValues> | undefined>();
  const [latestCalculationData, setLatestCalculationData] = useState<BmrCalculatorFormValues | undefined>();


  const hasUserInteracted = useRef(false);

  // [แก้ไข] useEffect หลัก สำหรับโหลดและคำนวณครั้งแรก
  useEffect(() => {
    hasUserInteracted.current = false;
    const loadInitialData = async () => {
      // ทำงานเฉพาะโหมด edit/view และมี id เท่านั้น
      if ((mode === ModeTypes.edit || mode === ModeTypes.view) && calculationId) {
        try {
          // 1. ดึงข้อมูล Recipe เก่าจาก API
          const apiData = await calculatorBMRService.getById(calculationId);
          const formValues = {
            name: apiData.peopleName,
            gender: apiData.sex,
            age: apiData.age,
            height: apiData.height,
            weight: apiData.weight,
            activityLevelId: apiData.activityId,
            factorUp: apiData.factorUp,
            formula: 'Revised Harris-Benedict',
          };

          const tdeeResult = {
            bmrCalorie: apiData.bmrCalorie,
            behaviours: apiData.behaviours
          }

          setInitialFormValues(formValues);
          setLatestCalculationData(formValues);
          setTdeeResult(tdeeResult);

        } catch (error) {
          console.error("Failed to load initial data", error);
        } finally {
          // 4. ปิดสถานะ Loading ของ "ทั้งหน้า" เมื่อทุกอย่างเสร็จสิ้น
          setIsPageLoading(false);
        }
      } else {
        setIsPageLoading(false);
      }
    };

    loadInitialData();
  }, [mode, calculationId]); // Dependency เหลือเท่าที่จำเป็นสำหรับการโหลดครั้งแรก


  const handleCalculate = async (data: BmrCalculatorFormValues) => {
    setIsCalculating(true);
    setLatestCalculationData(data);
    const requestBody: CalculationBMRRequestModel = {
      peopleName: '',
      sex: data.gender,
      age: data.age,
      height: data.height,
      weight: data.weight,
      activityId: data.activityLevelId,
      factorUp: data.factorUp,
    };

    const result = await calculatorBMRService.calculate(requestBody);
    if (!result) return;
    setTdeeResult(result);
    setIsCalculating(false);
  };

  const handleSubmitClick = async () => {
    if (!latestCalculationData) {
      showWarningAlert(t('กรุณากดคำนวณก่อนบันทึก'));
      return;
    }
    if (latestCalculationData.name === '') {
      showWarningAlert(t('กรุณากรอกชื่ออ้างอิง'));
      return;
    }

    const confirmResult = await showConfirmation();
    if (confirmResult.isConfirmed) {
      await handleSaveOrUpdate(latestCalculationData); // true = redirect
    }


  }

  const handleSaveOrUpdate = async (data: BmrCalculatorFormValues, redirectAfterSave: boolean = true) => {
    const requestBody: CalculationBMRRequestModel = {
      peopleName: data.name,
      sex: data.gender,
      age: data.age,
      height: data.height,
      weight: data.weight,
      activityId: data.activityLevelId,
      factorUp: data.factorUp,
    };

    const result = await calculatorBMRService.calculate(requestBody);
    if (!result) return;
    showSuccessAlert();
    if (mode === 'create') {
      setInitialFormValues(undefined)
      setTdeeResult(null);
    }
    else {
      onBack();
    }
  }


  const onBack = async () => {
    router.push('/ui/calculator-history-bmr');
  };

  const titles: Record<Mode, string> = {
    ['']: t('calculator_bmr.new'),
    [ModeTypes.create]: t('calculator_bmr.create'),
    [ModeTypes.edit]: t('calculator_bmr.edit'),
    [ModeTypes.view]: t('calculator_bmr.detail'),
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {titles[mode]}
          </h1>
          <p className="text-sm text-gray-500">{t('calculator_bmr.pageSubtitle')}</p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          {isViewMode ? (
            <></>
          ) : (
            <>
              {/* ปุ่ม Save/Update (แล้วกลับหน้ารายการ) */}
              <Button color="success" onClick={handleSubmitClick} disabled={isCalculating} className='btn'>
                <Icon icon="mdi:content-save-all" className="mr-2" />
                {(mode === 'edit' && '') ? t('button.update') : t('button.save')}
              </Button>
            </>
          )}
          <Button color="gray" onClick={onBack} className='btn btn-gray'>
            {isViewMode ? t('button.back') : t('button.cancel')}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        <div className="lg:col-span-2">
          <BmrInputForm onCalculate={handleCalculate} initialData={initialFormValues} isViewMode={isViewMode} />
        </div>
        <div className="lg:col-span-3">
          <BmrResultDisplay result={tdeeResult} isLoading={isCalculating} />
        </div>
      </div>
    </div>

  );
};

export default CalculatorBMRPage;