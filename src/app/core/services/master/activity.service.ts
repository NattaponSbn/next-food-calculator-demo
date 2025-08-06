import { MasterActivityItemsModel, MasterActivityResponseItemModel, MasterActivityRequestItemModel } from "../../models/master/activity/activity.model";
import { ActivityCommonModel, CommonModel, SuccessResponse } from "../../models/shared/common.model";
import { ApiSearchRequest, ItemsResponse, PageResult } from "../../models/shared/page.model";
import apiClient from "../api-client";

// --- กำหนด Path หลักของ Resource นี้ ---
const RESOURCE_PATH = '/activity';

/**
 * Factory Function สำหรับสร้าง Activity Service
 * @param apiClient - instance ของ Axios ที่ถูกเตรียมไว้แล้ว (มี Token)
 * @returns Object ที่มีฟังก์ชันสำหรับจัดการ Food Group
 */
export const activityService = {
  
  /**
   * ค้นหาข้อมูล Activity
   * @param request - Object ที่มี pageNumber, pageSize, criteria, sort
   * @returns PageResult ของ Activity
   */
  search: async (request: ApiSearchRequest): Promise<PageResult<MasterActivityItemsModel>> => {
    const result = await apiClient.post<PageResult<MasterActivityItemsModel>>(`${RESOURCE_PATH}/search`, request);
    return result.data!;
  },

  getById: async (id: number): Promise<MasterActivityResponseItemModel> => {
    // Interceptor ของเราแกะ .data มาแล้ว
    const result = await apiClient.get<MasterActivityResponseItemModel>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  create: async (createData: MasterActivityRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.post<SuccessResponse>(RESOURCE_PATH, createData);
    return result.data!;
  },

  update: async (id: number, updateData: MasterActivityRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.patch<SuccessResponse>(`${RESOURCE_PATH}/${id}`, updateData);
    return result.data!;
  },

  delete: async (id: number): Promise<SuccessResponse> => {
    const result = await apiClient.delete<SuccessResponse>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  getAll: async (): Promise<ItemsResponse<ActivityCommonModel[]>> => {
    // Interceptor ของเราแกะ .data มาแล้ว
    const result = await apiClient.get<ItemsResponse<ActivityCommonModel[]>>(`${RESOURCE_PATH}/all`);
    return result.data!;
  },

};