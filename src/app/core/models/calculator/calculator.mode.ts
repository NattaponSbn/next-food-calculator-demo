export class CalculatorRequestModel {
    materialId: string = "";
    nameThai: string = "";
    nameEng: string = "";
    categoryId!: number;
}

export class CalculatorItemsModel {
    kind!: string;
    id!: number;
    name!: string;
    nameEN!: string;
    description!: string;
    groupId!: number;
    dataPerUnit!: number;
    perUnitId!: number;
    ingredients!: CalculatorIngredientModel[];
    groupNutrients!: CalculatorGroupNutrientModel[];
}

export class CalculatorIngredientModel {
  kind!: string;
  ingredientId!: number;
  ingredientName!: string;
  dataPerUnit!: number;
  perUnitId!: number;
  perUnitName!: string;
}

export class CalculatorGroupNutrientModel {
  kind!: string;
  groupId!: number;
  groupName!: string;
  nutrients!: CalculatorNutrientModel[];
}

export class CalculatorNutrientModel {
  kind!: string;
  nutritionId!: number;
  nutritionName!: string;
  value!: string;
  unitId!: number;
  unitName!: string;
}

export class CalculatorRequestItemModel {
  name: string = "";
  nameEN: string = "";
  code: string = "";
  description: string = "";
  groupId!: number;
  dataPerUnit!: number;
  perUnitId!: number;
  ingredients: CalculationRequestItem[] = [];
}

export class CalculatorResponseItemModel {
  kind!: string;
  id!: number;
  name!: string;
  nameEN!: string;
  description!: string;
  groupId!: number
  dataPerUnit!: number
  perUnitId!: number
  ingredients!: CalculatorIngredientModel[];
  groupNutrients!: CalculatorGroupNutrientModel[];
}

export class CalculationRequestItem {
  ingredientId!: number;
  dataPerUnit!: number; // ปริมาณที่ผู้ใช้กรอก
  perUnitId!: number;   // ID ของหน่วยที่ใช้
}

export class CalculationRequestModel {
  ingredients!: CalculationRequestItem[];
}

export class CalculatedNutrientGroupModel {
  groupId!: number;
  groupName!: string; // 'Main Nutrients', 'Vitamins', etc.
  nutrients!: CalculatorNutrientModel[];
}

// Type ของ state `nutritionSummary` จะเป็น Array นี้
export type NutritionSummaryResponse = CalculatedNutrientGroupModel[];