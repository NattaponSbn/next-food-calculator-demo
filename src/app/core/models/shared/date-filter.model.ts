export enum DateFilterCondition {
  GreaterThanOrEqual = 'ge',
  LessThanOrEqual = 'le',
  Range = 'rng',
  GreaterThan = 'gt',
  LessThan = 'lt',
  Equal = 'eq',
}

export class DateFilterRequestModel {
  condition!: DateFilterCondition;
  fromDate!: string | null;
  toDate?: string | null;

  constructor(_condition: DateFilterCondition, _fromDate: string  | null, _toDate: string  | null) {
    this.condition = _condition;
    this.fromDate = _fromDate;
    if (_toDate) {
      this.toDate = _toDate;
    }
  }
}
