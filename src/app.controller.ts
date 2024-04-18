import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Historial Data')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Handler for retrieving only one ticker's historic data
   * @param ticker
   * @returns
   */
  @Get(':ticker')
  @ApiQuery({ name: 'from_date', required: false })
  @ApiQuery({ name: 'to_date', required: false })
  findHistoricalPrices(
    @Param('ticker') ticker: string,
    @Query('from_date') from_date: string,
    @Query('to_date') to_date: string,
  ) {
    return this.appService.findHistoricalPrices(ticker, { to_date, from_date });
  }
}
