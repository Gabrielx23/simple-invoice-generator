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
import { PaymentTypeEnum } from '../../../Invoice/Domain/Enum/payment-type.enum';
import { Type } from 'class-transformer';
import { AddInvoiceRowDTO } from './add-invoice-row.dto';

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

  @ApiProperty({ example: 'John Doe' })
  @MinLength(3)
  @MaxLength(30)
  createdBy: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AddInvoiceRowDTO)
  rows: AddInvoiceRowDTO[];
}
