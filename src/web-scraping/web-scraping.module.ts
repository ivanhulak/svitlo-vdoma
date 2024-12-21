import { Global, Module } from '@nestjs/common';
import { ProductsModule } from 'src/products/products.module';
import { WebScrapingService } from './web-scraping.service';

@Global()
@Module({
  providers: [WebScrapingService],
  exports: [WebScrapingService],
  imports: [ProductsModule],
})
export class WebScrapingModule {}
