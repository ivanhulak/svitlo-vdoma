import { ApiProperty } from '@nestjs/swagger';
// @ts-ignore
import { Supplier } from '@prisma/client';
import { Category } from 'src/categories/entities/category.entity';

export class PriceRangeDto {
  @ApiProperty()
  min: number;

  @ApiProperty()
  max: number;
}

export class FilterResponseDto {
  @ApiProperty({ type: () => [Category] })
  categories: Partial<Category & { productsCount: number }>[];

  @ApiProperty({ type: [String] })
  manufacturers: Partial<Supplier>[];

  @ApiProperty({ type: PriceRangeDto })
  priceRange: PriceRangeDto;
}
