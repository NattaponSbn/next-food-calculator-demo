export class MasterUnitsItemsModel {
  unitId!: string;
  unitCode!: string;
  nameEng!: string;
  nameThai!: string;
  unitType!: 'Weight' | 'Energy' | 'Volume' | 'Other';
  status!: 'ACTIVE' | 'INACTIVE';
  updatedBy!: string;
  updatedAt!: string; // ISO DateTime string

  code!: string;
  name!: string;
  nameEN!: string;
  description!: string;
  id!: number;
}

// สำหรับใช้ในฟอร์มสร้าง/แก้ไข
export class MasterUnitsRequestModel {
  unitCode: string = '';
  nameEng: string = '';
  nameThai: string = '';
  unitType: 'Weight' | 'Energy' | 'Volume' | 'Other' = 'Weight';
  description: string = '';
  status: string[] = [];
}

export class MasterUnitsRequestItemModel {
  name!: string;
  code!: string;
  description!: string;
}

export class MasterUnitsResponseItemModel {
  id!: number;
  name!: string;
  code!: string;
  description!: string;
} 