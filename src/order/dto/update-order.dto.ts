import {
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @IsArray()
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsOptional()
  items?: Partial<CreateOrderItemDto>[];

  @IsInt()
  @ApiProperty()
  @IsOptional()
  totalAmount?: number;

  @IsString()
  @ApiProperty()
  @IsOptional()
  status?: string;
}
