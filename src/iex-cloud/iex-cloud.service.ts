import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IEXService {
  /**
   * Define IEX Endpoints properties
   */
  readonly token: string;
  readonly historic_prices: string;
  readonly company_info: string;
  readonly company_logo: string;
  readonly ticker_symbols: string;

  /**
   * Constructs an instance of the ApiService by initializing various URLs
   * from the configuration service.
   *
   * @param config - The configuration service containing necessary URLs.
   */
  constructor(private config: ConfigService) {
    try {
      this.token = this.config.get('IEX_TOKEN');

      this.historic_prices = this.config.get('IEX_HISTORIC_PRICES_URL');

      this.company_info = this.config.get('IEX_COMPANY_INFO_URL');

      this.company_logo = this.config.get('IEX_COMPANY_LOGO_URL');

      this.ticker_symbols = this.config.get('IEX_SYMBOLS_URL');
    } catch (error) {
      // Handle any errors that occur during initialization
      console.error('Error occurred during ApiService initialization:', error);
      // Optionally rethrow the error if it should be handled elsewhere
      throw error;
    }
  }
}
