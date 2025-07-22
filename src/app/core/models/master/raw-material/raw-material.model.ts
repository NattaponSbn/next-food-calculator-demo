import { CalculatorIngredientModel, CalculatorResponseItemModel } from "../../calculator/calculator.mode";

export class MasterRawMaterialRequestModel {
  materialId: string = "";
  nameThai: string = "";
  nameEng: string = "";
  categoryId!: number;
}

export class MasterRawMaterialItemsModel {
  kind?: string;
  id!: number
  name!: string;
  nameEN?: string;
  foodId?: string;
  description?: string;
  groupId?: number
  dataPerUnit!: string
  perUnitId!: number
  nutritions?: MasterRawMaterialNutritionModel[]
  perUnitName!: string;
}

export class MasterRawMaterialNutritionModel {
  kind?: string;
  nutritionId!: number;
  value!: string;
  nutritionName!: string;
  unitId!: number;
}

export class MasterRawMaterialRequestItemModel {
  name: string = "";
  nameEN: string = "";
  foodId: string = "";
  description: string = "";
  groupId!: number;
  dataPerUnit!: number;
  perUnitId!: number;
  nutritions: MasterRawMaterialNutritionModel[] = [];
}

export class MasterRawMaterialResponseItemModel {
  kind: string = "";
  id!: number;
  name: string = "";
  nameEN: string = "";
  foodId: string = "";
  description: string = "";
  groupId!: number;
  dataPerUnit!: number;
  perUnitId!: number;
  nutritions: MasterRawMaterialNutritionModel[] = [];
  perUnitName: string = "";
}

export class MasterRawSelectedIngredientModel {
  id!: number;
  data!: MasterRawMaterialItemsModel;
  quantity!: string;
  unit!: string;
}
export class MasterRawNutritionSummaryModel {
  mainNutrients!: { [key: string]: string };
  vitamins!: { [key: string]: string };
  minerals!: { [key: string]: string };
}