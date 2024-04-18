import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum } from 'class-validator';
import { DateRangeTypeEnum } from 'src/enums/date-range-types.enum';

export class TickerDto {
  @ApiProperty({ example: TickerDto.date().start, required: false })
  @IsDateString({ strict: true })
  from_date: string;

  @ApiProperty({
    example: TickerDto.date().now,
    required: false,
  })
  @IsDateString({ strict: true })
  to_date: string;

  @ApiProperty({
    name: 'date_range',
    description: 'y=Year To Date | 6m=Six Months | y=One Year | 5d=Five Days',
    enum: DateRangeTypeEnum,
    enumName: 'date_range',
    required: false,
  })
  @IsEnum(DateRangeTypeEnum)
  @Optional()
  date_range: DateRangeTypeEnum;

  /**
   * Returns an object containing the start date of the current year and the current date.
   *
   * @returns An object with 'start' representing the start date of the current year in YYYY-MM-DD format,
   * and 'now' representing the current date in YYYY-MM-DD format.
   */
  static date() {
    // Get the current date
    const date = new Date();

    // Extract the year from the current date
    const year = date.getFullYear();

    // Extract the month from the current date and format it with leading zeros
    const month = (date.getUTCMonth() + 1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    });

    return {
      start: `${year}-01-01`, // Start date of the current year
      now: `${year}-${month}-${date.getDate()}`, // Current date
    };
  }
}
