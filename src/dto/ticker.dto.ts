import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class TickerDto {
  @ApiProperty({ example: 'spy' })
  @IsString()
  ticker: string;

  @ApiProperty({ example: 'YYYY-MM-DD' })
  @IsDateString({ strict: true })
  from_date: string;

  @ApiProperty({ example: 'YYYY-MM-DD' })
  @IsDateString({ strict: true })
  to_date: string;
}
