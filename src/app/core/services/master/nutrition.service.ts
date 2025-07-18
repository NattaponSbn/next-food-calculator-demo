// src/app/core/services/food-group.service.ts

import { MasterNutrientItemsModel, MasterNutrientRequestItemModel, MasterNutrientResponseItemModel } from "../../models/master/nutrients/nutrient.model";
import { CommonModel, NutritionCommonModel, SuccessResponse } from "../../models/shared/common.model";
import { ApiSearchRequest, ItemsResponse, PageResult } from "../../models/shared/page.model";
import apiClient from "../api-client";

// --- กำหนด Path หลักของ Resource นี้ ---
const RESOURCE_PATH = '/nutrition';

/**
 * Factory Function สำหรับสร้าง Nutrition Group Service
 * @param apiClient - instance ของ Axios ที่ถูกเตรียมไว้แล้ว (มี Token)
 * @returns Object ที่มีฟังก์ชันสำหรับจัดการ Food Group
 */
export const nutritionService = {
  
  /**
   * ค้นหาข้อมูล Nutrition Group
   * @param request - Object ที่มี pageNumber, pageSize, criteria, sort
   * @returns PageResult ของ Nutrition Group
   */
  search: async (request: ApiSearchRequest): Promise<PageResult<MasterNutrientItemsModel>> => {
    const result = await apiClient.post<PageResult<MasterNutrientItemsModel>>(`${RESOURCE_PATH}/search`, request);
    return result.data!;
  },

  getById: async (id: number): Promise<MasterNutrientResponseItemModel> => {
    // Interceptor ของเราแกะ .data มาแล้ว
    const result = await apiClient.get<MasterNutrientResponseItemModel>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  create: async (createData: MasterNutrientRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.post<SuccessResponse>(RESOURCE_PATH, createData);
    return result.data!;
  },

  update: async (id: number, updateData: MasterNutrientRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.patch<SuccessResponse>(`${RESOURCE_PATH}/${id}`, updateData);
    return result.data!;
  },

  delete: async (id: number): Promise<SuccessResponse> => {
    const result = await apiClient.delete<SuccessResponse>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  getAll: async (): Promise<ItemsResponse<NutritionCommonModel[]>> => {
    // Interceptor ของเราแกะ .data มาแล้ว
    const result = await apiClient.get<ItemsResponse<NutritionCommonModel[]>>(`${RESOURCE_PATH}/all`);
    return result.data!;
  },
};