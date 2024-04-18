import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IEXServiceModule } from './iex-cloud/iex-cloud.module';
import { IEXService } from './iex-cloud/iex-cloud.service';

@Module({
  imports: [IEXServiceModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, IEXServiceModule, IEXService, ConfigService],
  exports: [IEXService],
})
export class AppModule {}
