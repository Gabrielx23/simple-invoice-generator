import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRepository } from './Database/Repositories/company.repository';
import { providers } from './Providers';
import { CompanyGateway } from './Providers/company.gateway';
import { controllers } from './Controllers';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyRepository])],
  controllers: [...controllers],
  providers: [...providers],
  exports: [CompanyGateway],
})
export class CompanyModule {}
