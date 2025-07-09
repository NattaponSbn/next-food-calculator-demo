export class MasterNutrientRequestModel {
  // ... property สำหรับการ filter/search ...
  name: string = '';
  nutrientCode: string = '';
  status: string[] = [];
}

// Model สำหรับข้อมูลแต่ละรายการในตาราง
export class MasterNutrientItemsModel {
  nutrientId!: string;       // PK
  nutrientCode!: string;
  nameThai!: string;
  nameEng!: string;
  defaultUnit!: string;      // หน่วยพื้นฐาน
  nutrientGroupId!: string;  // FK
  groupName!: string;       // Denormalized
  displayOrder!: number;
  status!: 'ACTIVE' | 'INACTIVE';
  updatedAt!: string;
  updatedBy!: string;
  code!: string;
  name!: string;
  nameEN!: string;
  description!: string;
  id!: number;
}

export class MasterNutrientRequestItemModel {
  name!: string;
  code!: string;
  description!: string;
}

export class MasterNutrientResponseItemModel {
  id!: number;
  name!: string;
  code!: string;
  description!: string;
} 