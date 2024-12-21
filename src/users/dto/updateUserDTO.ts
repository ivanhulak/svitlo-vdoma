import { IsOptional, IsString, IsInt, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() username?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() street?: string;
  @IsOptional() @IsString() apartment?: string;
  @IsOptional() @IsString() building?: string;
  @IsOptional() @IsString() image?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsInt() lightCoins?: number;
  @IsOptional() @IsInt() mainBalance?: number;
}
