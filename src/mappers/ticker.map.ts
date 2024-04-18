import { isUndefined, omitBy } from 'lodash';
import { TickerDto } from 'src/dto/ticker.dto';
import { Ticker } from 'src/entities/ticker.entity';
import { DateRangeTypeEnum } from 'src/enums/date-range-types.enum';

export class TickerMapper {
  /**
   * Maps a TickerDto object to a Ticker domain object.
   *
   * @param raw - The TickerDto object to be mapped.
   * @returns A Ticker domain object based on the provided TickerDto.
   */
  public static toDomain(raw: TickerDto): Ticker {
    // Determine the 'to' date based on input conditions
    const to =
      (raw.to_date && raw.date_range) || (raw.to_date && !raw.from_date)
        ? undefined
        : raw.to_date;

    // Determine the 'from' date based on input conditions
    const from =
      (raw.from_date && raw.date_range) || (raw.from_date && !raw.to_date)
        ? undefined
        : raw.from_date;

    // Determine the date range type based on input conditions
    const range =
      !to && !from && !raw.date_range
        ? DateRangeTypeEnum.Year_To_Date
        : raw.date_range;

    // Create a Ticker object based on the determined values, excluding any undefined properties
    return omitBy(new Ticker(from, to, range), isUndefined);
  }
}
