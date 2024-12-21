import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from 'src/users/dto/userDto';

export class RegisterResponseDto {
  @ApiProperty()
  @IsString()
  refresh_token: string;

  @ApiProperty()
  @IsString()
  access_token: string;

  @ApiProperty()
  user: User;
}
