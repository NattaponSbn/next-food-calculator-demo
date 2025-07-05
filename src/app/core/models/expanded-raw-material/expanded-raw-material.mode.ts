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
