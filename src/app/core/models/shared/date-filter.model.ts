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
  fromDate!: string;
  toDate?: string;

  constructor(_condition: DateFilterCondition, _fromDate: string, _toDate: string) {
    this.condition = _condition;
    this.fromDate = _fromDate;
    if (_toDate) {
      this.toDate = _toDate;
    }
  }
}
