// src/app/core/services/food-group.service.ts

import { SuccessResponse } from "../../models/shared/common.model";
import { ApiSearchRequest, PageResult } from "../../models/shared/page.model";
import apiClient from "../api-client";
import { MasterNutrientCategoriesItemsModel, MasterNutrientCategoriesRequestItemModel, MasterNutrientCategoriesResponseItemModel } from "../../models/master/nutrient-categories/nutrient-categories.model";

// --- กำหนด Path หลักของ Resource นี้ ---
const RESOURCE_PATH = '/nutrition-group';

/**
 * Factory Function สำหรับสร้าง Nutrition Group Service
 * @param apiClient - instance ของ Axios ที่ถูกเตรียมไว้แล้ว (มี Token)
 * @returns Object ที่มีฟังก์ชันสำหรับจัดการ Food Group
 */
export const nutritionGroupService = {
  
  /**
   * ค้นหาข้อมูล Nutrition Group
   * @param request - Object ที่มี pageNumber, pageSize, criteria, sort
   * @returns PageResult ของ Nutrition Group
   */
  search: async (request: ApiSearchRequest): Promise<PageResult<MasterNutrientCategoriesItemsModel>> => {
    const result = await apiClient.post<PageResult<MasterNutrientCategoriesItemsModel>>(`${RESOURCE_PATH}/search`, request);
    return result.data!;
  },

  getById: async (id: number): Promise<MasterNutrientCategoriesResponseItemModel> => {
    // Interceptor ของเราแกะ .data มาแล้ว
    const result = await apiClient.get<MasterNutrientCategoriesResponseItemModel>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  create: async (createData: MasterNutrientCategoriesRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.post<SuccessResponse>(RESOURCE_PATH, createData);
    return result.data!;
  },

  update: async (id: number, updateData: MasterNutrientCategoriesRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.patch<SuccessResponse>(`${RESOURCE_PATH}/${id}`, updateData);
    return result.data!;
  },

  delete: async (id: number): Promise<SuccessResponse> => {
    const result = await apiClient.delete<SuccessResponse>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },
};