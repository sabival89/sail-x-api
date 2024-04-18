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

  static date() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getUTCMonth() + 1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    });

    return {
      start: `${year}-01-01`,
      now: `${year}-${month}-${date.getDate()}`,
    };
  }
}
