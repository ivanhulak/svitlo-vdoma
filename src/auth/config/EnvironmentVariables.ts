import { IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  APP_BE_ORIGIN: string;
}
