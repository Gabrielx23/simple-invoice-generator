import {
  IsEnum,
  IsNumber,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceRowUnitEnum } from '../../../Invoice/Domain/Enum/invoice-row-unit.enum';

export class AddInvoiceRowDTO {
  @ApiProperty({ example: 'IT Service 03/21' })
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: InvoiceRowUnitEnum.piece })
  @IsEnum(InvoiceRowUnitEnum)
  unit: InvoiceRowUnitEnum;

  @ApiProperty({ example: '12.99' })
  @Matches(/^\d+(?:[.,]\d+)*$/)
  price: string;

  @ApiProperty({ example: 23 })
  @IsNumber()
  vat: number;
}
