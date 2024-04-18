import { Injectable } from '@nestjs/common';
import { TickerDto } from './dto/ticker.dto';

@Injectable()
export class AppService {
  //process.env.SERVER
  findHistoricalPrices(ticker: string, tickerDto: TickerDto) {
    console.log('hello');
    return { value: ticker, tickerDto };
  }
}
