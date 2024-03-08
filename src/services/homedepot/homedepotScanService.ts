import { Scraper } from 'src/services/scrapers/scraper.abstract';
import { Injectable, Logger } from '@nestjs/common';
import { Furniture } from 'src/services/furniture/furniture.entity';
import { ShopScanService } from '../scan/scanService.abstract';
import { FurnitureService } from '../furniture/furniture.service';

@Injectable()
export class HomedepotScanService implements ShopScanService {
  private readonly logger = new Logger(HomedepotScanService.name);

  readonly homeUrl = 'https://www.homedepot.com';

  constructor(
    private readonly scraper: Scraper,
    private readonly furnitureService: FurnitureService,
  ) {}

  async scan(keyword: string): Promise<Furniture[]> {
    const urlWithSearchKeyword =
      this.homeUrl + '/s/?keyword=' + encodeURIComponent(keyword);
    const selectors = {
      productListSelector: 'div.results-wrapped',
      productSelector: 'div.product-pod--s5vy1',
      nameSelector: 'div.product-header__title--fourline--4y7oa',
      priceSelector: 'div.price-format__main-price',
      imageSelector: 'div.product-image__wrapper--dmvgq img',
      linkSelector: 'a.product-image',
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

      await this.scraper.waitForSelectors(page, Object.values(selectors), 5000);
      const products = await this.scraper.scan(page, selectors);
      const furnitures = products.map((product) => {
        return new Furniture({
          ...product,
          productLink: product.productLink.startsWith('https://')
            ? product.productLink
            : this.homeUrl + product.productLink,
          searchKeyword: keyword,
          storeName: 'homedepot',
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
