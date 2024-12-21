import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UnauthorizedDto {
  @ApiProperty()
  @IsString()
  message: string;
}
