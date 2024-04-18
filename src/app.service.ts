import { Injectable, Logger } from '@nestjs/common';
import { TickerDto } from './dto/ticker.dto';
import { IEXService } from './iex-cloud/iex-cloud.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { TickerMapper } from './mappers/ticker.map';
import { Ticker } from './entities/ticker.entity';

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

  //TODO Check to make sure date range provided is not large
  //TODO If no to and from date is provided, assume the time period is ytd
  // TODO Calculate daily returns for the days specified
  /**
   *
   * @param ticker
   * @param tickerDto
   * @returns
   */
  async findHistoricalPrices(ticker: string, tickerDto: TickerDto) {
    const { data } = await this.api(this.iex_url.historic_prices, {
      path: ticker,
      searchParams: TickerMapper.toDomain(tickerDto),
    });

    return {
      value: ticker,
      data,
      tickerDto,
      iex: this.iex_url.historic_prices,
    };
  }

  async api(
    url: string,
    {
      path,
      searchParams,
    }: {
      path: string;
      searchParams: Ticker;
    },
  ) {
    return await firstValueFrom(
      this.httpService
        .get(`${url}/${path}`, {
          params: {
            token: `${this.iex_url.token}`,
            ...searchParams,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Error in fetching ticker historical prices: `,
              error,
            );
            throw 'An error happened!';
          }),
        ),
    );
  }
}
