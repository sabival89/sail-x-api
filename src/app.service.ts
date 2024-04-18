import { Injectable } from '@nestjs/common';
import { TickerDto } from './dto/ticker.dto';
import { IEXService } from './iex-cloud/iex-cloud.service';

@Injectable()
export class AppService {
  protected iex: IEXService;

  /**
   *
   * @param iexConfig
   */
  constructor(protected iexConfig: IEXService) {
    // Initialize iex config
    this.iex = iexConfig;
  }

  //TODO Check to make sure date range provided is not large
  //TODO If no to and from date is provided, assume the time period is ytd
  // TODO Calculate daily returns for the days specified
  /**
   *
   * @param ticker
   * @param tickerDto
   * @returns
   */
  findHistoricalPrices(ticker: string, tickerDto: TickerDto) {
    return { value: ticker, tickerDto, iex: this.iex.historic_prices };
  }
}
