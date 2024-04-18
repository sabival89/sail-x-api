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
  @Get('/sailx/:ticker')
  @ApiParam({
    name: 'ticker',
    example: 'SPY',
    description: 'Specify only one ticker symbol.',
  })
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
  @Get('/sailx/:ticker/:benchmark/tickers')
  @ApiParam({
    name: 'ticker',
    example: 'SPY',
  })
  @ApiParam({
    name: 'benchmark',
    example: 'AAPL',
  })
  findHistoricalPricesWithBenchmark(
    @Param('ticker') ticker: string,
    @Param('benchmark') benchmark: string,
    @Query() params: TickerDto,
  ) {
    return this.appService.findHistoricalPricesWithBenchmark(
      ticker,
      benchmark,
      {
        ...params,
      },
    );
  }

  /**
   *
   * @param params
   * @returns
   */
  @Get('/symbols')
  getAllSymbols(
    @Query()
    params: PaginationDto,
  ) {
    return this.appService.getAllSymbols({ ...params });
  }
}
