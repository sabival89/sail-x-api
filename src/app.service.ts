import { Injectable, Logger } from '@nestjs/common';
import { TickerDto } from './dto/ticker.dto';
import { IEXService } from './iex-cloud/iex-cloud.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { TickerMapper } from './mappers/ticker.map';
import { Ticker } from './entities/ticker.entity';
import { isUndefined, omitBy } from 'lodash';

type APIServiceProps = {
  path?: string;
  searchParams: Ticker | { limit?: string; offset?: string; last?: string };
};

type DailyReturn = {
  close: number;
  priceDate: string;
  symbol: string;
  earnings: number;
};

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  /**
   *
   * @param iexConfig
   */
  constructor(
    private readonly iex_url: IEXService,
    private readonly httpService: HttpService,
  ) {}

  // TODO Check to make sure date range provided is not large
  // TODO If no to and from date is provided, assume the time period is ytd
  // TODO Calculate daily returns for the days specified
  // TODO Implement pagination
  /**
   *
   * @param ticker
   * @param tickerDto
   * @returns
   */
  async findHistoricalPrices(ticker: string, tickerDto: TickerDto) {
    const trimmedTicker =
      ticker.indexOf(',') > -1
        ? ticker.substring(0, ticker.indexOf(','))
        : ticker;

    const { data } = await this.api(this.iex_url.historic_prices, {
      path: trimmedTicker,
      searchParams: TickerMapper.toDomain(tickerDto),
    });

    const historicalDataProps = this.extractHistoricalDataProps(data);

    const result = historicalDataProps.length
      ? this.calculateDailyReturns(historicalDataProps)
      : [];

    return {
      data: result,
      totalRecords: result.length || 0,
    };
  }

  async findHistoricalPricesWithBenchmark(
    ticker: string,
    benchmark: string,
    tickerDto: TickerDto,
  ) {
    //TODO ADD decorator validation for benchmark and ticker
    const { data } = await this.api(this.iex_url.historic_prices, {
      path: `${ticker},${benchmark}`,
      searchParams: TickerMapper.toDomain(tickerDto),
    });

    const historicalDataProps = this.extractHistoricalDataProps(data);

    const tickerAverageDailyReturn = this.calculateAverageDailyReturn(
      historicalDataProps.filter((data) => data.symbol === ticker),
    );

    const benchmarkAverageDailyReturn = this.calculateAverageDailyReturn(
      historicalDataProps.filter((data) => data.symbol === benchmark),
    );

    const alpha = tickerAverageDailyReturn - benchmarkAverageDailyReturn;

    return { alpha };
  }

  /**
   *
   * @param param0
   * @returns
   */
  async getAllSymbols(params) {
    const { data } = await this.api(this.iex_url.ticker_symbols, {
      searchParams: omitBy({ ...params }, isUndefined),
    });
    return { data, totalRecords: data.length || 0 };
  }

  /**
   *
   * @param historicData
   * @returns
   */
  calculateDailyReturns(historicData: Array<DailyReturn>): Array<DailyReturn> {
    const historicEarnings = historicData.reduce(
      (dailyReturns, currentPrice, index, array) => {
        if (index < array.length - 1) {
          const previousPrice = array[index + 1].close;

          const earnings =
            ((currentPrice.close - previousPrice) / previousPrice) * 100;
          dailyReturns.push({ ...historicData[index], earnings });
        }

        return dailyReturns;
      },
      [] as Array<DailyReturn>,
    );

    const lastElement = historicData[historicData.length - 1];
    const lastDailyReturn = lastElement ? [lastElement] : [];

    return [...historicEarnings, ...lastDailyReturn];
  }

  calculateAverageDailyReturn(historicData: Array<DailyReturn>): number {
    const dailyReturns = this.calculateDailyReturns(historicData);

    const total = dailyReturns.reduce(
      (sum, dailyReturn) => sum + dailyReturn.earnings,
      0,
    );

    const average = total / dailyReturns.length;

    return average;
  }

  /**
   *
   * @param url
   * @param apiServiceProps
   * @returns
   */
  async api(url: string, apiServiceProps?: APIServiceProps) {
    return await firstValueFrom(
      this.httpService
        .get(`${url}/${apiServiceProps?.path || ''}`, {
          params: {
            token: `${this.iex_url.token}`,
            ...(apiServiceProps ? apiServiceProps.searchParams : {}),
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`Error in fetching ticker data `, error);
            throw 'An error happened!';
          }),
        ),
    );
  }

  /**
   *
   * @param data
   * @returns
   */
  extractHistoricalDataProps(data: Array<DailyReturn>): Array<DailyReturn> {
    return data.map(({ close, priceDate, symbol, earnings }) => ({
      close,
      priceDate,
      symbol,
      earnings: earnings || 0,
    }));
  }
}
