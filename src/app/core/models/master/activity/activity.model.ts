export class MasterActivityRequestModel {
  unitCode: string = '';
  nameEng: string = '';
  nameThai: string = '';
  unitType: 'Weight' | 'Energy' | 'Volume' | 'Other' = 'Weight';
  description: string = '';
  status: string[] = [];
}

export class MasterActivityItemsModel {
  id!: number;
  name!: string;
  nameEN!: string;
  code!: string;
  description!: string;
}

export class MasterActivityRequestItemModel {
  name!: string;
  nameEN!: string;
  code!: string;
  description!: string;
  factorUp!: number;
}

export class MasterActivityResponseItemModel {
  id!: number;
  name!: string;
  nameEN!: string;
  code!: string;
  description!: string;
  factorUp!: number;
} 