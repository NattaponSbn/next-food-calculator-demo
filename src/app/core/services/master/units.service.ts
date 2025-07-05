// src/app/core/services/food-group.service.ts

import { MasterUnitsItemsModel, MasterUnitsRequestItemModel, MasterUnitsResponseItemModel } from "../../models/master/units/units.model";
import { SuccessResponse } from "../../models/shared/common.model";
import { ApiSearchRequest, PageResult } from "../../models/shared/page.model";
import apiClient from "../api-client";

// --- กำหนด Path หลักของ Resource นี้ ---
const RESOURCE_PATH = '/nutrition-unit';

/**
 * Factory Function สำหรับสร้าง Units Service
 * @param apiClient - instance ของ Axios ที่ถูกเตรียมไว้แล้ว (มี Token)
 * @returns Object ที่มีฟังก์ชันสำหรับจัดการ Units
 */
export const unitsService = {
  
  /**
   * ค้นหาข้อมูล Units
   * @param request - Object ที่มี pageNumber, pageSize, criteria, sort
   * @returns PageResult ของ Units
   */
  search: async (request: ApiSearchRequest): Promise<PageResult<MasterUnitsItemsModel>> => {
    const result = await apiClient.post<PageResult<MasterUnitsItemsModel>>(`${RESOURCE_PATH}/search`, request);
    return result.data!;
  },

  getById: async (id: number): Promise<MasterUnitsResponseItemModel> => {
    // Interceptor ของเราแกะ .data มาแล้ว
    const result = await apiClient.get<MasterUnitsResponseItemModel>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },

  create: async (createData: MasterUnitsRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.post<SuccessResponse>(RESOURCE_PATH, createData);
    return result.data!;
  },

  update: async (id: number, updateData: MasterUnitsRequestItemModel): Promise<SuccessResponse> => {
    const result = await apiClient.patch<SuccessResponse>(`${RESOURCE_PATH}/${id}`, updateData);
    return result.data!;
  },

  delete: async (id: number): Promise<SuccessResponse> => {
    const result = await apiClient.delete<SuccessResponse>(`${RESOURCE_PATH}/${id}`);
    return result.data!;
  },
};