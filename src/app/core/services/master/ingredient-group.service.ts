import { CommonModel, SuccessResponse } from "../../models/shared/common.model";
import { MasterIngredientGroupItemsModel, MasterIngredientGroupResponseItemModel, MasterIngredientGroupRequestItemModel } from "../../models/master/ingredient-group/ingredient-group.mode";
import { ApiSearchRequest, ItemsResponse, PageResult } from "../../models/shared/page.model";
import apiClient from "../api-client";

// --- กำหนด Path หลักของ Resource นี้ ---
const RESOURCE_PATH = '/ingredient-group';

/**
 * Factory Function สำหรับสร้าง Ingredient Group Service
 * @param apiClient - instance ของ Axios ที่ถูกเตรียมไว้แล้ว (มี Token)
 * @returns Object ที่มีฟังก์ชันสำหรับจัดการ Food Group
 */
export const ingredientGroupService = {
  
  /**
   * ค้นหาข้อมูล Ingredient Group
   * @param request - Object ที่มี pageNumber, pageSize, criteria, sort
   * @returns PageResult ของ Ingredient Group
   */
  search: async (request: ApiSearchRequest): Promise<PageResult<MasterIngredientGroupItemsModel>> => {
    const result = await apiClient.post<PageResult<MasterIngredientGroupItemsModel>>(`${RESOURCE_PATH}/search`, request);
    return result.data!;
  },

  getById: async (id: number): Promise<MasterIngredientGroupResponseItemModel> => {
    // Interceptor ของเราแกะ .data มาแล้ว
    const result = await apiClient.get<MasterIngredientGroupResponseItemModel>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  create: async (createData: MasterIngredientGroupRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.post<SuccessResponse>(RESOURCE_PATH, createData);
    return result.data!;
  },

  update: async (id: number, updateData: MasterIngredientGroupRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.patch<SuccessResponse>(`${RESOURCE_PATH}/${id}`, updateData);
    return result.data!;
  },

  delete: async (id: number): Promise<SuccessResponse> => {
    const result = await apiClient.delete<SuccessResponse>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  getAll: async (): Promise<ItemsResponse<CommonModel[]>> => {
    // Interceptor ของเราแกะ .data มาแล้ว
    const result = await apiClient.get<ItemsResponse<CommonModel[]>>(`${RESOURCE_PATH}/all`);
    return result.data!;
  },

};