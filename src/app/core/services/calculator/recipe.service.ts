import { SuccessResponse } from "../../models/shared/common.model";
import { ApiSearchRequest, PageResult } from "../../models/shared/page.model";
import apiClient from "../api-client";
import { CalculatorItemsModel, CalculatorResponseItemModel, CalculatorRequestItemModel, NutritionSummaryResponse, CalculationRequestModel } from "../../models/calculator/calculator.mode";

// --- กำหนด Path หลักของ Resource นี้ ---
const RESOURCE_PATH = '/recipe';

/**
 * Factory Function สำหรับสร้าง Recipe Service
 * @param apiClient - instance ของ Axios ที่ถูกเตรียมไว้แล้ว (มี Token)
 * @returns Object ที่มีฟังก์ชันสำหรับจัดการ Food Group
 */
export const recipeService = {
  
  /**
   * ค้นหาข้อมูล Recipe
   * @param request - Object ที่มี pageNumber, pageSize, criteria, sort
   * @returns PageResult ของ Recipe
   */
  search: async (request: ApiSearchRequest): Promise<PageResult<CalculatorItemsModel>> => {
    const result = await apiClient.post<PageResult<CalculatorItemsModel>>(`${RESOURCE_PATH}/search`, request);
    return result.data!;
  },

  getById: async (id: number): Promise<CalculatorResponseItemModel> => {
    // Interceptor ของเราแกะ .data มาแล้ว
    const result = await apiClient.get<CalculatorResponseItemModel>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  create: async (createData: CalculatorRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.post<SuccessResponse>(RESOURCE_PATH, createData);
    return result.data!;
  },

  update: async (id: number, updateData: CalculatorRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.patch<SuccessResponse>(`${RESOURCE_PATH}/${id}`, updateData);
    return result.data!;
  },

  delete: async (id: number): Promise<SuccessResponse> => {
    const result = await apiClient.delete<SuccessResponse>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  calculate: async (createData: CalculationRequestModel): Promise<NutritionSummaryResponse> => {
    const result = await apiClient.post<NutritionSummaryResponse>(`${RESOURCE_PATH}/calculate`, createData, { showLoading: false });
    return result.data!;
  },

};