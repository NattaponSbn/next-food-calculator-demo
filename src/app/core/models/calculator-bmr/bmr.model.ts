export class CalculatorBMRRequestModel {
    code: string = "";
    name: string = "";
}

export class CalculatorBMRItemsModel {
  kind!: string;
  id!: number
  peopleName!: string;
  sex!: number
  age!: number
  height!: number
  weight!: number
  activityId!: number
  activityName!: string;
  calculateDate!: string;
}

export class CalculatorBMRModel {
  kind!: string;
  ingredientId!: number;
  ingredientName!: string;
  dataPerUnit!: string;
  perUnitId!: number;
  perUnitName!: string;
}


export class CalculationBMRRequestModel {
  peopleName?: string = "";
  sex!: number;
  age!: number;
  height!: number;
  weight!: number;
  activityId!: number;
  factorUp!: number;
}

export class CalculatorBMRResponseByItemModel {
  kind!: string;
  id!: number;
  peopleName!: string;
  sex!: number;
  age!: number;
  height!: number;
  weight!: number;
  activityId!: number;
  factorUp!: number;
  activityName!: string;
  calculateDate!: string;
  bmrCalorie!: number;
  behaviours: CalculatorBMRBehaviourModel[] = [];
}

export class CalculatorBMRResponseItemModel {
  bmrCalorie!: number;
  behaviours: CalculatorBMRBehaviourModel[] = [];
}

export class CalculatorBMRBehaviourModel {
  kind!: string;
  id!: number;
  name!: string;
  nameEN!: string;
  weight!: string;
  unitName!: string;
  calorie!: number;
  percent!: number;
  colorCode!: string;
}