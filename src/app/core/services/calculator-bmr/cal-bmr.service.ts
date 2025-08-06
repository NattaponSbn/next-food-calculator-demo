import { SuccessResponse } from "../../models/shared/common.model";
import { ApiSearchRequest, PageResult } from "../../models/shared/page.model";
import apiClient from "../api-client";
import { CalculationBMRRequestModel, CalculatorBMRItemsModel, CalculatorBMRResponseByItemModel, CalculatorBMRResponseItemModel } from "../../models/calculator-bmr/bmr.model";

// --- กำหนด Path หลักของ Resource นี้ ---
const RESOURCE_PATH = '/bmr';

/**
 * Factory Function สำหรับสร้าง Calculator BMRS Service
 * @param apiClient - instance ของ Axios ที่ถูกเตรียมไว้แล้ว (มี Token)
 * @returns Object ที่มีฟังก์ชันสำหรับจัดการ BMRS
 */
export const calculatorBMRService = {
  
  /**
   * ค้นหาข้อมูล BMRS
   * @param request - Object ที่มี pageNumber, pageSize, criteria, sort
   * @returns PageResult ของ BMRS
   */
  search: async (request: ApiSearchRequest): Promise<PageResult<CalculatorBMRItemsModel>> => {
    const result = await apiClient.post<PageResult<CalculatorBMRItemsModel>>(`${RESOURCE_PATH}/search`, request);
    return result.data!;
  },

  getById: async (id: number): Promise<CalculatorBMRResponseByItemModel> => {
    // Interceptor ของเราแกะ .data มาแล้ว
    const result = await apiClient.get<CalculatorBMRResponseByItemModel>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  delete: async (id: number): Promise<SuccessResponse> => {
    const result = await apiClient.delete<SuccessResponse>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  calculate: async (createData: CalculationBMRRequestModel): Promise<CalculatorBMRResponseItemModel> => {
    const result = await apiClient.post<CalculatorBMRResponseItemModel>(`${RESOURCE_PATH}/calculate`, createData, { showLoading: false });
    return result.data!;
  },

};