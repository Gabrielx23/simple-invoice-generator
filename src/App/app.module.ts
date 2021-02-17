import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mainConfig } from './Config/main.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './Config/database.config';
import { CqrsModule } from '@nestjs/cqrs';
import { InvoiceModule } from '../Invoice/invoice.module';

@Module({
  imports: [
    InvoiceModule,
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mainConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
