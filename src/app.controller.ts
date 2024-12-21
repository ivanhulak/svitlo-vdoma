import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import { PythonService } from './python/python.service';
import { WebScrapingService } from './web-scraping/web-scraping.service';
import { OpenAiService } from './openai/openai.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly webScrapingService: WebScrapingService,
    private readonly aiService: OpenAiService,
  ) {}

  @Get()
  async getHello() {
    // const scriptPath = path.join('parser.py');
    // return await this.aiService.analizeMarket();
    // await this.webScrapingService.scrape('https://comfy.ua/ua/lantern/');
    return 'ok';
  }
}
