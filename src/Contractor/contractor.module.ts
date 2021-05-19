import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractorRepository } from './Database/Repositories/contractor.repository';
import { providers } from './Providers';
import { ContractorGateway } from './Providers/contractor.gateway';
import { controllers } from './Controllers';

@Module({
  imports: [TypeOrmModule.forFeature([ContractorRepository])],
  controllers: [...controllers],
  providers: [...providers],
  exports: [ContractorGateway],
})
export class ContractorModule {}
