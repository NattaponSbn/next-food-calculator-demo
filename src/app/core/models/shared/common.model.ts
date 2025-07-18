export class CommonModel {
  kind!: string;
  isCheck?: boolean;
  id!: number;
  name!: string;
  nameEN!: string;
  code?: string;
  description?: string;
}


export class SuccessResponse {
  isSuccess!: boolean;
  message: string | null = '';
}


export class NutritionCommonModel {
  kind!: string;
  id!: number;
  name!: string;
  nameEN!: string;
  code!: string;
  description!: string;
  groupId!: number;
  primaryUnitId!: number;
  unitName!: string;
  isRequire!: boolean;
}

export class UnitCommonModel {
  kind!: string;
  id!: number;
  name!: string;
  nameEN!: string;
  initial!: string;
  code!: string;
  description!: string;
}

export class NutritionGroupCommonModel {
  kind!: string;
  id!: number;
  name!: string;
  nameEN!: string;
  initial!: string;
  code!: string;
  description!: string;
  priority!: number;
}

