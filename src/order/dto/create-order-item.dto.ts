import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  quantity: number;

  @IsInt()
  price: number;
}
