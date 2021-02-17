import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InvoiceRowDTO } from './invoice-row.dto';
import { PaymentTypeEnum } from '../../Domain/Enum/payment-type.enum';

export class CreateInvoiceDTO {
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
