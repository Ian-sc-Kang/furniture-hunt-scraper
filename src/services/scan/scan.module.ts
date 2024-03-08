import { Module } from '@nestjs/common';
import { ScanService } from './scan.service';
import { ScanController } from './scan.controller';
import { FurnitureModule } from '../furniture/furniture.module';
import { CostcoModule } from '../costco/costco.module';
import { AshleyModule } from '../ashley/ashley.module';
import { IkeaModule } from '../ikea/ikea.module';
import { WalmartModule } from '../walmart/walmart.module';
import { LivingSpacesModule } from '../livingSpaces/livingSpaces.module';
import { HomedepotModule } from '../homedepot/homedepot.module';
import { WayfairModule } from '../wayfair/wayfair.module';

@Module({
  imports: [
    AshleyModule,
    CostcoModule,
    IkeaModule,
    FurnitureModule,
    WalmartModule,
    LivingSpacesModule,
    HomedepotModule,
    WayfairModule,
  ],
  controllers: [ScanController],
  providers: [ScanService],
  exports: [ScanService],
})
export class ScanModule {}
