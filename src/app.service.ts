import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  //process.env.SERVER
  findHistoricalPrices(ticker: string) {
    console.log('hello');
    return { value: ticker };
  }
}
