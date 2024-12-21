import { Module } from '@nestjs/common';
import OpenAIApi from 'openai';
import { MarketResearchModule } from 'src/market-research/market-research.module';
import { OpenAIModule } from 'src/openai/openai.module';
import { PrismaService } from 'src/prisma.service';
import { ProductsModule } from 'src/products/products.module';
import { WebScrapingModule } from 'src/web-scraping/web-scraping.module';
import { TasksService } from './tasks.service';
import { OrderModule } from 'src/order/order.module';

@Module({
  providers: [TasksService, PrismaService],
  exports: [TasksService],
  imports: [
    ProductsModule,
    OpenAIModule,
    OpenAIApi,
    MarketResearchModule,
    WebScrapingModule,
    OrderModule,
  ],
})
export class TasksModule {}
