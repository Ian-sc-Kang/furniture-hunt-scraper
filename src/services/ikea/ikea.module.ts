import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Scraper } from 'src/services/scrapers/scraper.abstract';
import { Furniture } from 'src/services/furniture/furniture.entity';
import { IkeaScanService } from './ikeaScanService';
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
    IkeaScanService,
    { provide: Scraper, useClass: PuppeteerScraper },
  ],
  exports: [IkeaScanService],
})
export class IkeaModule {}
