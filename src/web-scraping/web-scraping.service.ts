import { Injectable, Logger } from '@nestjs/common';
import { Builder, By, Key, WebElement } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as fs from 'fs-extra';
import { ProductsService } from '../products/products.service';

type Product = {
  name: string;
  price: number;
  rate: number;
  commentsCount: number;
  category: string;
};

@Injectable()
export class WebScrapingService {
  constructor(private readonly productsService: ProductsService) {}
  private readonly logger = new Logger(WebScrapingService.name);
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11.6; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
  ];

  async scrape(categoryUrl: string) {
    const options = new chrome.Options();
    options.addArguments(
      `user-agent=${this.userAgents[Math.floor(Math.random() * this.userAgents.length)]}`,
    );
    // options.addArguments('--disable-blink-features=AutomationControlled');
    options.addArguments('headless');

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    const categoryName = categoryUrl.split('/').slice(-1)[0];
    await driver.get(categoryUrl);

    for (let i = 0; i < 5; i++) {
      await driver.findElement(By.tagName('body')).sendKeys(Key.END);
      await this.randomDelay(1, 3);
    }

    const productElements = await driver.findElements(
      By.css('div.products-catalog-grid__item'),
    );
    const productsList = await this.constructProductsArray(
      productElements,
      categoryName,
    );

    await driver.quit();

    const sortedProducts = this.sortProductsByPopularity(productsList);
    const dbProducts = await this.productsService.findAll({ pageSize: 50 });

    await fs.writeFile(
      'products.json',
      JSON.stringify(
        { competitorProducts: sortedProducts, databaseProducts: dbProducts },
        null,
        4,
      ),
      'utf-8',
    );
    this.logger.log(
      'Scraping completed. Product details saved to products.json',
    );

    return sortedProducts;
  }

  private async randomDelay(minSeconds: number, maxSeconds: number) {
    const delay = Math.random() * (maxSeconds - minSeconds) + minSeconds;
    return new Promise((resolve) => setTimeout(resolve, delay * 1000));
  }

  private async constructProductsArray(
    elements: WebElement[],
    category: string,
  ) {
    const productDetailsList = [];
    for (const product of elements) {
      try {
        const name = await product
          // .findElement(By.css('a.products-list-item__name')) 21.12.2024
          .findElement(By.css('a.prdl-item__name'))
          .getText();
        const price = parseFloat(
          (
            await product
              .findElement(
                By.css('div.products-list-item-price__actions-price-current'),
              )
              .getText()
          )
            .slice(0, -1)
            .replace(' ', ''),
        );
        let rate = 0.0;
        try {
          rate = parseFloat(
            await product
              .findElement(By.css('span.rating-number-box__value'))
              .getText(),
          );
        } catch (error) {
          this.logger.warn('Rate element not found, setting rate to 0.0');
        }
        const commentsCount = parseFloat(
          await product
            // .findElement(By.css('div.products-list-item__reviews'))
            .findElement(By.css('div.prdl-item__reviews'))
            .getText(),
        );
        productDetailsList.push({ name, price, rate, commentsCount, category });
      } catch (error) {
        this.logger.error(`An error occurred: ${error}`);
      }
    }
    return productDetailsList;
  }

  private sortProductsByPopularity(products: Product[], limit = 20) {
    const calculatePopularity = (product: any) => {
      return product.rate * 2 + product.commentsCount - product.price * 0.1;
    };

    return products
      .sort((a, b) => calculatePopularity(b) - calculatePopularity(a))
      .slice(0, limit);
  }
}
