import { Scraper } from 'src/services/scrapers/scraper.abstract';
import { Injectable, Logger } from '@nestjs/common';
import { Furniture } from 'src/services/furniture/furniture.entity';
import { ShopScanService } from '../scan/scanService.abstract';
import { FurnitureService } from '../furniture/furniture.service';

@Injectable()
export class AshleyScanService implements ShopScanService {
  private readonly logger = new Logger(AshleyScanService.name);

  readonly homeUrl = 'https://www.ashleyfurniture.com';

  constructor(
    private readonly scraper: Scraper,
    private readonly furnitureService: FurnitureService,
  ) {}

  async scan(keyword: string): Promise<Furniture[]> {
    const urlWithSearchKeyword =
      this.homeUrl + '/search-results/?q=' + encodeURIComponent(keyword);
    const selectors = {
      productListSelector: 'ul#search-result-items',
      productSelector: 'div.product-tile',
      nameSelector: 'div.product-name a.name-link',
      priceSelector:
        'div.product-pricing span.product-sales-price, div.product-pricing span.sale-price, div.product-pricing span.kit-price-info',
      imageSelector: 'div.product-image img',
      linkSelector: 'div.product-name a.name-link',
    };
    try {
      const browser = await this.scraper.launch();

      const page = await this.scraper.page(browser);
      // headless 모드에서는 setViewport 와 setUserAgent는 필수
      await this.scraper.setUserAgent(
        page,
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
      );
      await this.scraper.goto(page, urlWithSearchKeyword);
      await this.scraper.setViewport(page, { width: 1080, height: 1024 });
      await this.scraper.goto(page, urlWithSearchKeyword);

      await this.scraper.waitForSelectors(
        page,
        [selectors.productListSelector],
        3000,
      );
      const products = await this.scraper.scan(page, selectors);
      const furnitures = products.map(
        (product) =>
          new Furniture({
            ...product,
            searchKeyword: keyword,
            storeName: 'ashley',
          }),
      );
      await this.scraper.closePage(page);
      await this.scraper.closeBrowser(browser);
      this.logger.log(`${products.length} ${keyword} results`);

      this.furnitureService.save(furnitures);
      return furnitures;
    } catch (err) {
      this.logger.error(err.message);

      return [];
    }
  }
}
