import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import OpenAIApi from 'openai';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { MarketResearchModule } from './market-research/market-research.module';
import { OpenAIModule } from './openai/openai.module';
import { OrderModule } from './order/order.module';
import { ProductsModule } from './products/products.module';
import { PythonModule } from './python/python.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { WebScrapingModule } from './web-scraping/web-scraping.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    SubcategoriesModule,
    ManufacturersModule,
    PythonModule,
    WebScrapingModule,
    OpenAIModule,
    OpenAIApi,
    ScheduleModule.forRoot(),
    MarketResearchModule,
    TasksModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
