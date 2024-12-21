import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Country } from '../types/product.types';
export class CreateProductDto {
  @ApiProperty()
  description: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  stockCount: number;
  @ApiProperty()
  rating: number;
  @ApiPropertyOptional()
  salePrice?: number;
  @ApiPropertyOptional()
  lightCoins?: number;
  @ApiProperty()
  characteristics: Record<string, any>[];
  @ApiPropertyOptional()
  manufacturer?: string;
  @ApiPropertyOptional()
  subCategoryId?: string;
  @ApiPropertyOptional()
  country?: Country;
}
