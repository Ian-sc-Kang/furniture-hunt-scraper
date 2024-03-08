import { Scraper } from 'src/services/scrapers/scraper.abstract';
import { Injectable, Logger } from '@nestjs/common';
import { Furniture } from 'src/services/furniture/furniture.entity';
import { ShopScanService } from '../scan/scanService.abstract';
import { FurnitureService } from '../furniture/furniture.service';

@Injectable()
export class WayfairScanService implements ShopScanService {
  private readonly logger = new Logger(WayfairScanService.name);

  readonly homeUrl = 'https://www.wayfair.com';

  constructor(
    private readonly scraper: Scraper,
    private readonly furnitureService: FurnitureService,
  ) {}

  async scan(keyword: string): Promise<Furniture[]> {
    const urlWithSearchKeyword =
      this.homeUrl + '/keyword.php?keyword=' + encodeURIComponent(keyword);
    const selectors = {
      productListSelector: 'div#sbprodgrid',
      productSelector: 'div[data-hb-id="ProductCard"]',
      nameSelector: 'div[data-enzyme-id="productNameSpacing"]',
      priceSelector: 'div.SFPrice',
      imageSelector: 'img[data-cypress-id="imageComponent"]',
      linkSelector: 'a[data-enzyme-id="BrowseProductCardWrapper-component"]',
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
      await delayToWaitForImages(3000);
      await this.scraper.waitForSelectors(page, Object.values(selectors), 3000);
      const products = await this.scraper.scan(page, selectors);
      const furnitures = products.map((product) => {
        return new Furniture({
          ...product,
          productLink: product.productLink.startsWith('https://')
            ? product.productLink
            : this.homeUrl + product.productLink,
          searchKeyword: keyword,
          storeName: 'wayfair',
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

function delayToWaitForImages(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
}
