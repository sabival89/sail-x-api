import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { TickerDto } from './dto/ticker.dto';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Historial Data')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   *
   * @param ticker
   * @param params
   * @returns
   */
  @Get('sailx/:ticker')
  findHistoricalPrices(
    @Param('ticker') ticker: string,
    @Query() params: TickerDto,
  ) {
    return this.appService.findHistoricalPrices(ticker, {
      ...params,
    });
  }

  /**
   *
   * @param tickers
   * @param params
   * @returns
   */
  @Get('sailx/:tickers')
  @ApiParam({ name: 'tickers', example: 'SPY,AAPL' })
  findHistoricalPricesWithBenchmark(
    @Param('tickers') tickers: string,
    @Query() params: TickerDto,
  ) {
    return this.appService.findHistoricalPrices(tickers, {
      ...params,
    });
  }

  /**
   *
   * @param params
   * @returns
   */
  @Get('sailx/symbols')
  getAllSymbols(
    @Query()
    params: PaginationDto,
  ) {
    return this.appService.getAllSymbols({ ...params });
  }
}
