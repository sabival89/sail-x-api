import { DateRangeTypeEnum } from 'src/enums/date-range-types.enum';

export class Ticker {
  from?: string;
  to?: string;
  range?: DateRangeTypeEnum;

  /**
   * Represents a time range for fetching historical data.
   */
  constructor(from?: string, to?: string, range?: DateRangeTypeEnum) {
    this.from = from;
    this.to = to;
    this.range = range;
  }
}
