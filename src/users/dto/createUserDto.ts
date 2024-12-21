import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsOptional()
  street: string;

  @ApiProperty()
  @IsOptional()
  apartment: string;

  @ApiProperty()
  @IsOptional()
  building: string;

  @ApiProperty()
  @IsOptional()
  image: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsOptional()
  resetToken: string;

  @ApiProperty()
  @IsOptional()
  resetTokenExpiry: Date;
}
