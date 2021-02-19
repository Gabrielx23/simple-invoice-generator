import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InvoiceRowDTO } from './invoice-row.dto';
import { PaymentTypeEnum } from '../../Domain/Enum/payment-type.enum';
import { ContractorEntity } from '../../../Contractor/Database/Entities/contractor.entity';
import { CompanyEntity } from '../../../Company/Database/Entities/company.entity';

export class CreateInvoiceDTO {
  @ApiProperty({ example: '91e56daf-04ef-4bbc-abe7-5d3a8ee41101' })
  @IsUUID()
  contractorId: string;

  contractor: ContractorEntity;

  @ApiProperty({ example: '91e56daf-04ef-4bbc-abe7-5d3a8ee41101' })
  @IsUUID()
  companyId: string;

  company: CompanyEntity;

  @ApiProperty({ example: '2021-08-10' })
  @IsDateString()
  invoiceDate: Date;

  @ApiProperty({ example: '2021-08-10' })
  @IsDateString()
  deliveryDate: Date;

  @ApiProperty({ example: '2021-08-10' })
  @IsDateString()
  paymentDate: Date;

  @ApiProperty({ example: true })
  @IsBoolean()
  withVat: boolean;

  @ApiProperty({ example: PaymentTypeEnum.bankTransfer })
  @IsEnum(PaymentTypeEnum)
  paymentType: PaymentTypeEnum;

  @ApiProperty({ example: 'Warsaw' })
  @MinLength(3)
  @MaxLength(30)
  place: string;

  @ApiProperty({ example: 'John Doe' })
  @MinLength(3)
  @MaxLength(30)
  createdBy: string;

  @ApiProperty({ type: [InvoiceRowDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => InvoiceRowDTO)
  rows: InvoiceRowDTO[];
}
