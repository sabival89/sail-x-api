import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { TickerDto } from './dto/ticker.dto';

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
  findHistoricalPrices(
    @Param('ticker') ticker: string,
    @Query() tickerDto: TickerDto,
  ) {
    return this.appService.findHistoricalPrices(ticker, tickerDto);
  }
}
