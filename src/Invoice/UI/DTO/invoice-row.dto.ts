import {
  IsEnum,
  IsNumber,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceRowUnitEnum } from '../../Domain/Enum/invoice-row-unit.enum';

export class InvoiceRowDTO {
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
  @IsOptional()
  vat: number;
}
