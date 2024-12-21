import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class Balance {
  @ApiProperty()
  lightCoins: number;
  @ApiProperty()
  main: number;
}

export class User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiPropertyOptional()
  city: string;
  @ApiPropertyOptional()
  street: string;
  @ApiPropertyOptional()
  apartment: string;
  @ApiPropertyOptional()
  building: string;
  @ApiPropertyOptional()
  image: string;
  @ApiProperty()
  balance: Balance;
  @ApiProperty()
  phone: string;
  @ApiPropertyOptional()
  comments: Comment[];
  // @ApiPropertyOptional()
  // reviews: Review[];
  // @ApiPropertyOptional()
  // carts: Cart[];
  // @ApiPropertyOptional()
  // orders: Order[];
  @ApiPropertyOptional()
  resetToken?: string;
  @ApiPropertyOptional()
  resetTokenExpiry?: Date;
}
