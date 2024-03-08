import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Scraper } from 'src/services/scrapers/scraper.abstract';
import { Furniture } from 'src/services/furniture/furniture.entity';
import { HomedepotScanService } from './homedepotScanService';
import { PuppeteerModule } from 'src/services/scrapers/puppeteer/puppeteer.module';
import { FurnitureModule } from 'src/services/furniture/furniture.module';
import { PuppeteerScraper } from '../scrapers/puppeteer/puppeteerScraper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Furniture]),
    PuppeteerModule,
    FurnitureModule,
  ],
  controllers: [],
  providers: [
    HomedepotScanService,
    { provide: Scraper, useClass: PuppeteerScraper },
  ],
  exports: [HomedepotScanService],
})
export class HomedepotModule {}
