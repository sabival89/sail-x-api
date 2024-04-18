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
   * Constructs an instance of the class, initializing properties with provided dependencies.
   *
   * @param iex_url - An instance of the IEXService for accessing IEX API endpoints.
   * @param httpService - An instance of the HttpService for making HTTP requests.
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
   * Asynchronously fetches historical prices for a given ticker and returns daily returns.
   *
   * @param ticker - The symbol of the target stock.
   * @param tickerDto - Additional parameters for the ticker.
   * @returns An object containing daily returns data.
   */
  async findHistoricalPrices(ticker: string, tickerDto: TickerDto) {
    console.log(TickerMapper.toDomain(tickerDto));
    try {
      const trimmedTicker =
        ticker.indexOf(',') > -1
          ? ticker.substring(0, ticker.indexOf(','))
          : ticker;

      // Fetch historical prices data from the API
      const { data } = await this.api(this.iex_url.historic_prices, {
        path: trimmedTicker,
        searchParams: TickerMapper.toDomain(tickerDto),
      });

      // Extract relevant properties from the historical data
      const historicalDataProps = this.extractHistoricalDataProps(data);

      // Calculate daily returns if historical data is available
      const result = historicalDataProps.length
        ? this.calculateDailyReturns(historicalDataProps)
        : [];

      return {
        data: result,
        totalRecords: result.length || 0,
      };
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(
        'Error occurred while fetching or processing historical prices:',
        error,
      );
      return {
        data: [], // Return empty data in case of error
        totalRecords: 0,
        error:
          'Error occurred while fetching or processing historical prices. Please try again later.', // Optionally, you can include an error message
      };
    }
  }

  /**
   * Asynchronously fetches historical prices for a given ticker and benchmark,
   * calculates the alpha value, and returns it.
   *
   * @param ticker - The symbol of the target stock.
   * @param benchmark - The symbol of the benchmark stock.
   * @param tickerDto - Data transfer object containing additional parameters for the ticker.
   * @returns An object containing the calculated alpha value.
   */
  async findHistoricalPricesWithBenchmark(
    ticker: string,
    benchmark: string,
    tickerDto: TickerDto,
  ) {
    try {
      //TODO ADD decorator validation for benchmark and ticker

      // Fetch historical prices data from the API
      const { data } = await this.api(this.iex_url.historic_prices, {
        path: `${ticker},${benchmark}`,
        searchParams: TickerMapper.toDomain(tickerDto),
      });

      // Extract relevant properties from the historical data
      const historicalDataProps = this.extractHistoricalDataProps(data);

      // Calculate average daily return for the target stock
      const tickerAverageDailyReturn = this.calculateAverageDailyReturn(
        historicalDataProps.filter((data) => data.symbol === ticker),
      );

      // Calculate average daily return for the benchmark stock
      const benchmarkAverageDailyReturn = this.calculateAverageDailyReturn(
        historicalDataProps.filter((data) => data.symbol === benchmark),
      );

      // Calculate alpha value
      const alpha = tickerAverageDailyReturn - benchmarkAverageDailyReturn;

      return { alpha };
    } catch (error) {
      // Handle any errors that occur during the asynchronous operations
      console.error(
        'An error occurred while fetching historical prices:',
        error,
      );
      // You may choose to rethrow the error here or return a default value
      throw error;
    }
  }

  /**
   * Retrieves all symbols from the API.
   * @param {Object} params - Optional parameters for filtering symbols.
   * @returns {Object} An array of ticker symbols.
   */
  async getAllSymbols(params) {
    try {
      // Attempt to fetch symbols data from the API
      const { data } = await this.api(this.iex_url.ticker_symbols, {
        searchParams: omitBy({ ...params }, isUndefined),
      });

      // Return fetched data along with the total number of records
      return { data, totalRecords: data.length || 0 };
    } catch (error) {
      // If an error occurs during the fetch operation, handle it gracefully
      console.error('Error occurred while fetching symbols:', error);
      // You can choose to throw the error again or return a default/fallback value
      // throw error;
      return { data: [], totalRecords: 0 };
    }
  }

  /**
   * Calculates the daily returns based on the provided historic data.
   * @param historicData An array of DailyReturn objects representing historic data.
   * @returns An array of DailyReturn objects with calculated daily returns.
   */
  calculateDailyReturns(historicData: Array<DailyReturn>): Array<DailyReturn> {
    try {
      // Store calculated daily returns
      const historicEarnings = historicData.reduce(
        (dailyReturns, currentPrice, index, array) => {
          // Calculate daily return for each day except the last one
          if (index < array.length - 1) {
            const previousPrice = array[index + 1].close;

            // Calculate earnings as percentage change
            const earnings =
              ((currentPrice.close - previousPrice) / previousPrice) * 100;

            // Store new DailyReturn object with earnings to array
            dailyReturns.push({ ...historicData[index], earnings });
          }

          return dailyReturns;
        },
        [] as Array<DailyReturn>,
      );

      const lastElement = historicData[historicData.length - 1];
      const lastDailyReturn = lastElement ? [lastElement] : [];

      return [...historicEarnings, ...lastDailyReturn];
    } catch (error) {
      // Handle any errors that occur during calculation
      console.error('Error occurred while calculating daily returns:', error);
      // Return an empty array or handle the error in an appropriate way
      return [];
    }
  }

  /**
   * Calculates the average daily return based on historical data.
   * @param historicData Array of historical data for daily returns.
   * @returns The average daily return.
   */
  calculateAverageDailyReturn(historicData: Array<DailyReturn>): number {
    // Calculate daily returns for the provided historical data
    const dailyReturns = this.calculateDailyReturns(historicData);

    // Calculate the total earnings from the daily returns
    const total = dailyReturns.reduce(
      (sum, dailyReturn) => sum + dailyReturn.earnings,
      0,
    );

    // Calculate the average daily return
    const average = total / dailyReturns.length;

    return average;
  }

  /**
   * Makes an asynchronous API call to the specified URL.
   *
   * @param url The URL of the API endpoint.
   * @param apiServiceProps Additional properties for the API service (optional).
   * @returns A promise that resolves with the API response.
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
   * Extracts relevant properties from the provided array of daily return data.
   *
   * @param data Array of DailyReturn objects
   * @returns Array of DailyReturn objects with selected properties
   */
  extractHistoricalDataProps(data: Array<DailyReturn>): Array<DailyReturn> {
    return data.map(({ close, priceDate, symbol, earnings }) => ({
      close,
      priceDate,
      symbol,
      earnings: earnings || 0, // If earnings is missing or undefined, it defaults to 0.
    }));
  }
}
