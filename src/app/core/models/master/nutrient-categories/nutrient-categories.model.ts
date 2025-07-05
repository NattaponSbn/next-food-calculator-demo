export class MasterNutrientCategoriesRequestModel {
    materialId: string = "";
    nameThai: string = "";
    nameEng: string = "";
    categoryId!: number;
}

export class MasterNutrientCategoriesItemsModel {
    objectId!: string;
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
    description!: string;
    id!: number;
} 

export class MasterNutrientCategoriesRequestItemModel {
  name!: string;
  code!: string;
  description!: string;
} 

export class MasterNutrientCategoriesResponseItemModel {
  id!: number;
  name!: string;
  code!: string;
  description!: string;
} 