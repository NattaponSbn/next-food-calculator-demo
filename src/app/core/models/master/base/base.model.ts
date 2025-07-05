export class MasterBaseItemsModel {
  unitId!: string;
  unitCode!: string;
  nameEng!: string;
  nameThai!: string;
  unitType!: 'Weight' | 'Energy' | 'Volume' | 'Other';
  status!: 'ACTIVE' | 'INACTIVE';
  updatedBy!: string;
  updatedAt!: string; // ISO DateTime string
}

// สำหรับใช้ในฟอร์มสร้าง/แก้ไข
export class MasterBaseRequestModel {
  unitCode: string = '';
  nameEng: string = '';
  nameThai: string = '';
  unitType: 'Weight' | 'Energy' | 'Volume' | 'Other' = 'Weight';
  description: string = '';
  status: string[] = [];
}