import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mainConfig } from './Config/main.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './Config/database.config';
import { InvoiceModule } from '../Invoice/invoice.module';
import { ContractorModule } from '../Contractor/contractor.module';
import { CompanyModule } from '../Company/contractor.module';

@Module({
  imports: [
    InvoiceModule,
    ContractorModule,
    CompanyModule,
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
