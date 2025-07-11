import { SuccessResponse } from "../../models/shared/common.model";
import { ApiSearchRequest, PageResult } from "../../models/shared/page.model";
import apiClient from "../api-client";
import { ERMColumnHeaderStructureResponseModel, ERMNutritionItemsModel } from "../../models/expanded-raw-material/expanded-raw-material.mode";
import { MasterRawMaterialItemsModel, MasterRawMaterialResponseItemModel, MasterRawMaterialRequestItemModel } from "../../models/master/raw-material/raw-material.model";

// --- กำหนด Path หลักของ Resource นี้ ---
const RESOURCE_PATH = '/ingredient';

/**
 * Factory Function สำหรับสร้าง Ingredient  Service
 * @param apiClient - instance ของ Axios ที่ถูกเตรียมไว้แล้ว (มี Token)
 * @returns Object ที่มีฟังก์ชันสำหรับจัดการ Food 
 */
export const ingredientService = {
  
  /**
   * ค้นหาข้อมูล Ingredient 
   * @param request - Object ที่มี pageNumber, pageSize, criteria, sort
   * @returns PageResult ของ Ingredient 
   */
  search: async (request: ApiSearchRequest): Promise<PageResult<MasterRawMaterialItemsModel>> => {
    const result = await apiClient.post<PageResult<MasterRawMaterialItemsModel>>(`${RESOURCE_PATH}/search`, request);
    return result.data!;
  },

  getById: async (id: number): Promise<MasterRawMaterialResponseItemModel> => {
    // Interceptor ของเราแกะ .data มาแล้ว
    const result = await apiClient.get<MasterRawMaterialResponseItemModel>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  create: async (createData: MasterRawMaterialRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.post<SuccessResponse>(RESOURCE_PATH, createData);
    return result.data!;
  },

  update: async (id: number, updateData: MasterRawMaterialRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.patch<SuccessResponse>(`${RESOURCE_PATH}/${id}`, updateData);
    return result.data!;
  },

  delete: async (id: number): Promise<SuccessResponse> => {
    const result = await apiClient.delete<SuccessResponse>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  getInitialField: async (): Promise<ERMColumnHeaderStructureResponseModel> => {
    const result = await apiClient.get<ERMColumnHeaderStructureResponseModel>(`${RESOURCE_PATH}/initial-field`);
    return result.data!;
  },

  fullSearch: async (request: ApiSearchRequest): Promise<PageResult<ERMNutritionItemsModel>> => {
    const result = await apiClient.post<PageResult<ERMNutritionItemsModel>>(`${RESOURCE_PATH}/full/search`, request);
    return result.data!;
  },
};