import {
  IsNumberString,
  IsOptional,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyDTO {
  @ApiProperty({ example: 'Some Company Name' })
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: '11111111111111111111111111' })
  @Length(26)
  accountNumber: string;

  @ApiProperty({ example: 'Pekao' })
  @MinLength(3)
  @MaxLength(150)
  accountProvider: string;

  @ApiProperty({ example: '<svg></svg>' })
  @MaxLength(5000)
  @IsOptional()
  logo: string;

  @ApiProperty({ example: 'ul. Kwitowa 1/1, 10-100 Warsaw' })
  @MinLength(3)
  @MaxLength(100)
  address: string;

  @ApiProperty({ example: '1000000000' })
  @IsNumberString()
  @Length(10)
  vatId: string;
}
