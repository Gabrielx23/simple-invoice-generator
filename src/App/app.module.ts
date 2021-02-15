import { Module } from '@nestjs/common';
import { invoiceControllers } from './Invoice/Controllers';
import { ConfigModule } from '@nestjs/config';
import { mainConfig } from './Config/main.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './Config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mainConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
  ],
  controllers: [...invoiceControllers],
  providers: [],
})
export class AppModule {}
