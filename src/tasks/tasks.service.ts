import { MarketResearchService } from '../market-research/market-research.service';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OpenAiService } from 'src/openai/openai.service';
import { OrderService } from 'src/order/order.service';
import { ProductsService } from 'src/products/products.service';
import { WebScrapingService } from 'src/web-scraping/web-scraping.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly productsService: ProductsService,
    private readonly marketResearchService: MarketResearchService,
    private readonly webScrapingService: WebScrapingService,
    private readonly orderService: OrderService,
  ) {}
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_MINUTE)
  async ScrapeCron() {
    await this.webScrapingService.scrape(
      'https://comfy.ua/ua/charging-stations/',
    );
    const productIds = await this.openAiService.analizeMarket();
    console.log('\n\nproductIds', productIds);
    const products = await this.productsService.findProductsByIds(productIds);
    console.log('\n\nproducts', products);

    await this.marketResearchService.updateItems(products);

    console.log('====================================');
    console.log('updated');
    console.log('====================================');
  }
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCron() {
    const orders = await this.orderService.getSeasonOrders();

    const productCount: { [key: string]: number } = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productCount[item?.productId]) {
          productCount[item.productId] = 0;
        }
        productCount[item.productId] += item.quantity;
      });
    });

    const mostPopularProducts = Object.entries(productCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([productId]) => productId);

    await this.productsService.updateMany({
      where: {},
      data: {
        isSeasonal: false,
      },
    });

    await this.productsService.updateMany({
      where: {
        id: {
          in: mostPopularProducts,
        },
      },
      data: {
        isSeasonal: true,
      },
    });
  }
}
