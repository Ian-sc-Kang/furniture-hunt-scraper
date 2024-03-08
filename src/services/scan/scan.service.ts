import { HomedepotScanService } from './../homedepot/homedepotScanService';
import { WalmartScanService } from './../walmart/walmartScanService';
import { Injectable, Logger } from '@nestjs/common';
import { FurnitureService } from '../furniture/furniture.service';
import { CostcoScanService } from '../costco/costcoScanService';
import { AshleyScanService } from '../ashley/ashleyScanService';
import { IkeaScanService } from '../ikea/ikeaScanService';
import { LivingSpacesScanService } from '../livingSpaces/livingSpacesScanService';
import { WayfairScanService } from '../wayfair/wayfairScanService';

@Injectable()
export class ScanService {
  private readonly logger = new Logger(ScanService.name);

  constructor(
    private readonly costcoScanService: CostcoScanService,
    private readonly ashleyScanService: AshleyScanService,
    private readonly ikeaScanService: IkeaScanService,
    private readonly furnitureService: FurnitureService,
    private readonly walmartScanService: WalmartScanService,
    private readonly livingSpacesScanService: LivingSpacesScanService,
    private readonly homedepotScanService: HomedepotScanService,
    private readonly wayfairScanService: WayfairScanService,
  ) {}
  async scan(keyword: string) {
    const stores = [
      'costco',
      'ashley',
      'ikea',
      'walmart',
      'livingSpaces',
      'homedepot',
      'wayfair',
    ];
    // 먼저 키워드로 검색을 해본다.
    const results = await this.furnitureService.findAllByKeyword(
      keyword,
      stores,
    );

    // 검색결과를 가지고 각 스토어 마다 마지막으로 검색한 시간을 확인한다.
    const scannedStores = results.map((result) => result.storeName);
    const storesToScan = stores.filter(
      (store) => !scannedStores.includes(store),
    );

    // 각 스토어의 검색한 시간이 하루를 넘겼으면 다시 스캔을 하고, 아니면 바로 반환
    if (storesToScan.length === 0) {
      this.logger.log('all stores are scanned.');
      return results;
    }
    this.logger.log(`stores to scan: ${storesToScan}`);
    const [
      costcoResults,
      ashleyResults,
      ikeaResults,
      walmartResults,
      livingSpacesResults,
      homedepotResults,
      wayfairResults,
    ] = await Promise.all([
      storesToScan.find((store) => store === 'costco')
        ? this.costcoScanService.scan(keyword)
        : [],
      storesToScan.find((store) => store === 'ashley')
        ? this.ashleyScanService.scan(keyword)
        : [],
      storesToScan.find((store) => store === 'ikea')
        ? this.ikeaScanService.scan(keyword)
        : [],
      storesToScan.find((store) => store === 'walmart')
        ? this.walmartScanService.scan(keyword)
        : [],
      storesToScan.find((store) => store === 'livingSpaces')
        ? this.livingSpacesScanService.scan(keyword)
        : [],
      storesToScan.find((store) => store === 'homedepot')
        ? this.homedepotScanService.scan(keyword)
        : [],
      storesToScan.find((store) => store === 'wayfair')
        ? this.wayfairScanService.scan(keyword)
        : [],
    ]);

    return [
      ...results,
      ...costcoResults,
      ...ashleyResults,
      ...ikeaResults,
      ...walmartResults,
      ...livingSpacesResults,
      ...homedepotResults,
      ...wayfairResults,
    ];
    // }
  }
}
