import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  products: string[];
}
