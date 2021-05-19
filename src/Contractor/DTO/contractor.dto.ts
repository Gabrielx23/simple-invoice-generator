import { IsNumberString, Length, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContractorDTO {
  @ApiProperty({ example: 'Some Company Name' })
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'SomCompName' })
  @MinLength(1)
  @MaxLength(15)
  abbreviation: string;

  @ApiProperty({ example: 'ul. Kwitowa 1/1, 10-100 Warsaw' })
  @MinLength(3)
  @MaxLength(100)
  address: string;

  @ApiProperty({ example: '1000000000' })
  @IsNumberString()
  @Length(10)
  vatId: string;
}
