import { isUndefined, omitBy } from 'lodash';
import { TickerDto } from 'src/dto/ticker.dto';
import { Ticker } from 'src/entities/ticker.entity';
import { DateRangeTypeEnum } from 'src/enums/date-range-types.enum';

export class TickerMapper {
  public static toDomain(raw: TickerDto): Ticker {
    const to =
      (raw.to_date && raw.date_range) || (raw.to_date && !raw.from_date)
        ? undefined
        : raw.to_date;

    const from = raw.from_date && raw.date_range ? undefined : raw.from_date;

    const range =
      !to && !from && !raw.date_range
        ? DateRangeTypeEnum.Year_To_Date
        : raw.date_range;

    return omitBy(new Ticker(from, to, range), isUndefined);
  }
}
