import { Scraper } from 'src/services/scrapers/scraper.abstract';
import { Injectable, Logger } from '@nestjs/common';
import { Furniture } from 'src/services/furniture/furniture.entity';
import { ShopScanService } from '../scan/scanService.abstract';
import { FurnitureService } from '../furniture/furniture.service';

@Injectable()
export class WalmartScanService implements ShopScanService {
  private readonly logger = new Logger(WalmartScanService.name);

  readonly homeUrl = 'https://www.walmart.com';

  constructor(
    private readonly scraper: Scraper,
    private readonly furnitureService: FurnitureService,
  ) {}

  async scan(keyword: string): Promise<Furniture[]> {
    const urlWithSearchKeyword =
      this.homeUrl + '/search?q=' + encodeURIComponent(keyword);
    const selectors = {
      productListSelector: 'div[data-stack-index="0"]',
      productSelector: 'div[data-item-id]',
      nameSelector: 'span[data-automation-id="product-title"]',
      priceSelector:
        'div[data-automation-id="product-price"] div.mr1.mr2-xl.b.black.lh-copy.f5.f4-l',
      imageSelector: 'img[data-testid="productTileImage"]',
      linkSelector: 'div[role="group"] a[link-identifier]',
    };
    try {
      const browser = await this.scraper.launch();

      const page = await this.scraper.page(browser);
      // headless 모드에서는 setViewport 와 setUserAgent는 필수
      await this.scraper.setViewport(page, { width: 1080, height: 1024 });
      await this.scraper.setUserAgent(
        page,
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
      );
      await this.scraper.goto(page, urlWithSearchKeyword);

      await this.scraper.waitForSelectors(page, Object.values(selectors), 3000);
      const products = await this.scraper.scan(page, selectors);
      const furnitures = products.map((product) => {
        return new Furniture({
          ...product,
          productLink: product.productLink.startsWith('https://')
            ? product.productLink
            : this.homeUrl + product.productLink,
          searchKeyword: keyword,
          storeName: 'walmart',
        });
      });
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
