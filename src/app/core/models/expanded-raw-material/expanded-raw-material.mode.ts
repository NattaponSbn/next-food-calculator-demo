export class ExpandedRawMaterialModel {
  foodId!: string;
  nameThai!: string;
  nameEng!: string;
  // Main Nutrients
  energyKcal!: number | string | null;
  waterG!: number | null;
  proteinG!: number | null;
  fatG!: number | null;
  carbohydrateG!: number | null | string;
  dietaryFibreG!: number | null | string;
  ashG!: number | null;
  // Minerals
  calciumMg!: number | null;
  phosphorusMg!: number | null;
  magnesiumMg!: number | null;
  sodiumMg!: number | null;
  potassiumMg!: number | null;
  ironMg!: number | null;
  copperMg!: number | null;
  zincMg!: number | null;
  iodineUg!: number | null;
  // Vitamins
  betacaroteneUg!: number | null;
  retinolUg!: number | null;
  totalVitaminARae!: number | null;
  thiaminMg!: number | null | string;
  riboflavinMg!: number | null | string;
  niacinMg!: number | null;
  vitaminCMg!: number | null;
  vitaminEMg!: number | null;
  // Other
  sugarG!: number | null;
}


export class ERMColumnNutritionModel {
  id!: number;
  name!: string;
  nameEN!: string;
  code!: string; // นี่คือ accessorKey ที่เราจะใช้!
  unitName!: string;
}

export class ERMColumnNutrientFieldGroupModel {
  id!: number;
  name!: string; // 'Main nutrients'
  nutritions!: ERMColumnNutritionModel[];
}

export class ERMColumnHeaderStructureResponseModel {
  nutrientFieldGroups!: ERMColumnNutrientFieldGroupModel[];
}

// --- Model สำหรับ API ค้นหาข้อมูล (Search) ---
export class ERMColumnItemNutritionValueModel {
  nutritionId!: number;
  value!: string | number | null;
}

export class ERMNutritionItemsModel {
  id!: number;
  name!: string;    // nameThai
  nameEN!: string;  // nameEng
  foodId!: string;
  // ...ฟีลด์อื่นๆ ที่ตายตัว
  nutritions!: ERMColumnItemNutritionValueModel[]; // Array ของค่าสารอาหาร
}

export class ERMNutritionRequestModel {
  name: string = ""
  nameEN: string = ""
  foodId: string = ""
  groupId!: number;
  groupName: string = ""
}

