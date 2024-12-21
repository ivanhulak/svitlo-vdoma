import { Global, Module } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import OpenAIApi from 'openai';

@Global()
@Module({
  providers: [OpenAiService, OpenAIApi],
  exports: [OpenAiService],
  imports: [OpenAIApi],
})
export class OpenAIModule {}
