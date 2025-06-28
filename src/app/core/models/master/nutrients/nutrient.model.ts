// models/master/nutrients/nutrient.model.ts

// Model สำหรับข้อมูลแต่ละรายการในตาราง
export interface MasterNutrientItemsModel {
  nutrientId: string;       // PK
  nutrientCode: string;
  nameThai: string;
  nameEng: string;
  defaultUnit: string;      // หน่วยพื้นฐาน
  nutrientGroupId: string;  // FK
  groupName?: string;       // Denormalized
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  updatedAt: string;
  updatedBy: string;
}

// Model สำหรับ Request Body (ถ้ามี)
export class MasterNutrientRequestModel {
  // ... property สำหรับการ filter/search ...
  name: string = '';
  nutrientCode: string = '';
  status: string = '';
}