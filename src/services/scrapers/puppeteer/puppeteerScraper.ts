import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { Scraper, Selectors } from '../scraper.abstract';
import { Browser, Page, PuppeteerLaunchOptions } from 'puppeteer';
import { Injectable, Logger } from '@nestjs/common';
export type Product = {
  name: string;
  price: string;
  imageUrl: string;
  productLink: string;
};
@Injectable()
export class PuppeteerScraper implements Scraper {
  private readonly logger = new Logger(PuppeteerScraper.name);

  async launch(options?: PuppeteerLaunchOptions) {
    const browser = await puppeteer.launch(options);
    puppeteer.use(StealthPlugin());

    return browser;
  }

  async page(browser: Browser): Promise<Page> {
    //TODO: browserIndex에 browser 없을때 에러처리
    const pages = await browser.pages();

    return pages[0];
  }

  async setUserAgent(page: Page, userAgent: string) {
    await page.setUserAgent(userAgent);
  }

  async setHeaders(page: Page, headers: Record<string, any>) {
    page.setExtraHTTPHeaders(headers);
  }

  async setViewport(page: Page, viewport: { width: number; height: number }) {
    const { width, height } = viewport;
    await page.setViewport({ width, height });
  }

  async goto(page: Page, url: string) {
    await page.goto(url);
  }

  async waitForSelector(page: Page, selector: string, timeout?: number) {
    return await page.waitForSelector(selector, {
      timeout,
    });
  }

  async waitForSelectors(page: Page, selectors: string[], timeout?: number) {
    await Promise.all([
      ...selectors.map((selector) =>
        page.waitForSelector(selector, { timeout }),
      ),
    ]);
  }

  async scan(page: Page, selectors: Selectors) {
    try {
      const {
        productListSelector,
        productSelector,
        nameSelector,
        priceSelector,
        imageSelector,
        linkSelector,
      } = selectors;
      const resultHandle = await page.$(productListSelector);
      const products = await page.evaluate(
        (
          resultElements,
          productSelector,
          nameSelector,
          priceSelector,
          imageSelector,
          linkSelector,
        ) => {
          const results: Product[] = [];
          const furnitures = resultElements.querySelectorAll(productSelector);

          furnitures.forEach((furniture) => {
            const name =
              furniture
                .querySelector(nameSelector)
                ?.textContent.trim()
                .replace(/(\n|\t|\r)/g, '') ?? 'not found';
            const price =
              furniture
                .querySelector(priceSelector)
                ?.textContent.trim()
                .replace(/(\n|\t|\r)/g, '')
                .replace(/[a-zA-Z]/g, '') ?? 'not found';
            const imageUrl =
              furniture.querySelector(imageSelector)?.getAttribute('src') ??
              furniture.querySelector(imageSelector)?.getAttribute('srcset') ??
              furniture
                .querySelector(imageSelector)
                ?.getAttribute('data-src') ??
              'not found';
            const productLink =
              furniture.querySelector(linkSelector)?.getAttribute('href') ??
              'not found';
            results.push({
              name,
              price,
              imageUrl,
              productLink,
            });
          });
          return results;
        },
        resultHandle,
        productSelector,
        nameSelector,
        priceSelector,
        imageSelector,
        linkSelector,
      );
      return products;
    } catch (err) {
      this.logger.error(err.message);
    }
  }

  async closePage(page: Page) {
    await page.close();
  }

  async closeBrowser(browser: Browser) {
    await browser.close();
  }
}
