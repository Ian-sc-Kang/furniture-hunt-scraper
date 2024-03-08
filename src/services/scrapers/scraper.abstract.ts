import { Injectable } from '@nestjs/common';
import { Product } from './puppeteer/puppeteerScraper';
import type {
  Browser,
  ElementHandle,
  Page,
  PuppeteerLaunchOptions,
} from 'puppeteer';

export type Selectors = {
  productListSelector: string;
  productSelector: string;
  nameSelector: string;
  priceSelector: string;
  imageSelector: string;
  linkSelector: string;
};

@Injectable()
export abstract class Scraper {
  abstract launch(options?: PuppeteerLaunchOptions): Promise<Browser>; // return browserIndex
  abstract page(browser: Browser): Promise<Page>;
  abstract setUserAgent(page: Page, userAgent: string): Promise<void>;
  abstract setHeaders(page: Page, headers: Record<string, any>): Promise<void>;
  abstract setViewport(
    page: Page,
    viewport: { width: number; height: number },
  ): Promise<void>;
  abstract goto(page: Page, url: string): Promise<void>;
  abstract waitForSelector(
    page: Page,
    selector: string,
    timeout?: number,
  ): Promise<ElementHandle<Element>>;
  abstract waitForSelectors(
    page: Page,
    selectors: string[],
    timeout?: number,
  ): Promise<void>;
  abstract scan(page: Page, selector: Selectors): Promise<Product[]>;
  abstract closePage(page: Page): Promise<void>;
  abstract closeBrowser(browser: Browser): Promise<void>;
}
