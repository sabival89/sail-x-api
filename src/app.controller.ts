import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { TickerDto } from './dto/ticker.dto';

@ApiTags('Historical Prices Endpoint')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Handle request to retrieve daily returns for a given symbol over a specified time period
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
   * Handle request to retrieve the alpha value of the ticker vs. the benchmark over a specified time period
   * @param ticker
   * @param benchmark
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
   * Handle request to retrieve all ticker symbols info
   * @param params
   * @returns
   */
  @Get('/symbols')
  getAllSymbols(
    @Query()
    params,
  ) {
    return this.appService.getAllSymbols({ ...params });
  }
}
