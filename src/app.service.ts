import { Injectable } from '@nestjs/common';
import { TickerDto } from './dto/ticker.dto';

@Injectable()
export class AppService {
  //process.env.SERVER

  //TODO Check to make sure date range provided is not large
  //TODO If no to and from date is provided, assume the time period is ytd
  // TODO Calculate daily returns for the days specified
  findHistoricalPrices(ticker: string, tickerDto: TickerDto) {
    console.log('hello');

    // Validation

    return { value: ticker, tickerDto };
  }
}
