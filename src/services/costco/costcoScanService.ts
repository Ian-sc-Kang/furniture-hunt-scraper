import { Injectable, Logger } from '@nestjs/common';
import { Furniture } from 'src/services/furniture/furniture.entity';
import { FurnitureService } from 'src/services/furniture/furniture.service';
import { Scraper } from 'src/services/scrapers/scraper.abstract';
import { ShopScanService } from 'src/services/scan/scanService.abstract';

@Injectable()
export class CostcoScanService implements ShopScanService {
  private readonly logger = new Logger(CostcoScanService.name);
  readonly homeUrl = 'https://www.costco.com';

  constructor(
    private readonly scraper: Scraper,
    private readonly furnitureService: FurnitureService,
  ) {}
  async scan(keyword: string) {
    const urlWithSearchKeyword =
      this.homeUrl +
      '/CatalogSearch?dept=All&keyword=' +
      encodeURIComponent(keyword);
    const selectors = {
      productListSelector: 'div.product-list',
      productSelector: 'div.product',
      nameSelector: 'span.description',
      priceSelector: 'div.price',
      imageSelector: 'div.product-img-holder img',
      linkSelector: 'span.description a',
    };
    try {
      const browser = await this.scraper.launch();
      const page = await this.scraper.page(browser);
      await this.scraper.setViewport(page, { width: 1080, height: 1024 });
      await this.scraper.setUserAgent(
        page,
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
      );
      await this.scraper.goto(page, urlWithSearchKeyword);

      await this.scraper.waitForSelectors(
        page,
        [...Object.values(selectors)],
        3000,
      );

      const products = await this.scraper.scan(page, selectors);
      const furnitures = products.map(
        (product) =>
          new Furniture({
            ...product,
            searchKeyword: keyword,
            storeName: 'costco',
          }),
      );
      await this.scraper.closePage(page);
      await this.scraper.closeBrowser(browser);

      this.furnitureService.save(furnitures);
      this.logger.log(`${products.length} ${keyword} results`);
      return furnitures;
    } catch (err) {
      this.logger.error(err.message);
      console.log(err);

      return [];
    }
  }
}
