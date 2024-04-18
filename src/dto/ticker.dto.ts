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
    description: 'y=Year_To_Date | 6m=Six_Months | y=One_Year | 5d=Five_Days',
    enum: DateRangeTypeEnum,
    enumName: 'date_range',
    // example: DateRangeTypeEnum.Year_To_Date,
    required: false,
  })
  @IsEnum(DateRangeTypeEnum)
  @Optional()
  date_range: DateRangeTypeEnum;

  static date() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getUTCMonth() + 1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    const start = `${year}-01-01`;
    const now = `${year}-${month}-${date.getDate()}`;

    return { start, now };
  }
}
