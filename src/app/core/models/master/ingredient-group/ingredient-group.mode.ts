export class MasterIngredientGroupRequestModel {
    materialId: string = "";
    nameThai: string = "";
    nameEng: string = "";
    categoryId!: number;
}

export class MasterIngredientGroupItemsModel {
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

export class MasterIngredientGroupRequestItemModel {
  name!: string;
  code!: string;
  description!: string;
} 

export class MasterIngredientGroupResponseItemModel {
  id!: number;
  name!: string;
  code!: string;
  description!: string;
} 