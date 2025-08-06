export class MasterActivityRequestModel {
    materialId: string = "";
    nameThai: string = "";
    nameEng: string = "";
    categoryId!: number;
}

export class MasterActivityItemsModel {
    rawMaterialObjectId!: string;
    materialId!: string;
    nameThai!: string;
    nameEng!: string;
    categoryName!: string;
    baseUnit!: string;
    baseQuantity!: number;

    // สารอาหารหลัก
    energyKcal!: number;
    proteinG!: number;
    carbohydrateG!: number;
    fatTotalG!: number;
    status!: string;
    updatedAt!: string;
    updatedBy!: string;

    code!: string;
    name!: string;
    nameEN!: string;
    description!: string;
    id!: number;
} 

export class MasterActivityRequestItemModel {
  name!: string;
  nameEN!: string;
  code!: string;
  description!: string;
} 

export class MasterActivityResponseItemModel {
  id!: number;
  name!: string;
  nameEN!: string;
  code!: string;
  description!: string;
} 