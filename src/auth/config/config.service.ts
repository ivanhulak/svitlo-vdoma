import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './EnvironmentVariables';

@Injectable()
export class ConfigService extends NestConfigService<
  EnvironmentVariables,
  true
> {
  get<T extends keyof EnvironmentVariables>(
    property: T,
  ): EnvironmentVariables[T] {
    return super.get(property, { infer: true });
  }
}
