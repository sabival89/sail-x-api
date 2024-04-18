import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IEXService } from './iex-cloud.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [IEXService, ConfigService],
  exports: [IEXService],
})
export class IEXServiceModule {}
