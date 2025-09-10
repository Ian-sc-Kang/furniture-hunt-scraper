import { HomedepotScanService } from '../homedepot/homedepotScanService';
import { WalmartScanService } from '../walmart/walmartScanService';
import { Injectable, Logger } from '@nestjs/common';
import { FurnitureService } from '../furniture/furniture.service';
import { CostcoScanService } from '../costco/costcoScanService';
import { AshleyScanService } from '../ashley/ashleyScanService';
import { IkeaScanService } from '../ikea/ikeaScanService';
import { LivingSpacesScanService } from '../livingSpaces/livingSpacesScanService';
import { WayfairScanService } from '../wayfair/wayfairScanService';
import { Furniture } from '../furniture/furniture.entity';

/**
 * Main scan service that orchestrates furniture data collection
 * from multiple retail websites
 */
@Injectable()
export class ScanService {
  private readonly logger = new Logger(ScanService.name);
  
  private readonly SUPPORTED_STORES = [
    'costco',
    'ashley',
    'ikea',
    'walmart',
    'livingSpaces',
    'homedepot',
    'wayfair',
  ] as const;

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
  
  /**
   * Scans multiple furniture retailers for products matching the given keyword
   * 
   * @param keyword - The search term to look for
   * @returns Promise<Furniture[]> - Array of furniture items found across all stores
   */
  async scan(keyword: string): Promise<Furniture[]> {
    if (!keyword || keyword.trim().length === 0) {
      this.logger.warn('Empty search keyword provided');
      return [];
    }

    const sanitizedKeyword = keyword.trim().toLowerCase();
    this.logger.log(`Starting scan for keyword: ${sanitizedKeyword}`);
    
    // First, check if we have cached results for this keyword
    const results = await this.furnitureService.findAllByKeyword(
      sanitizedKeyword,
      this.SUPPORTED_STORES,
    );

    // Determine which stores need to be scanned based on existing results
    const scannedStores = [...new Set(results.map((result) => result.storeName))];
    const storesToScan = this.SUPPORTED_STORES.filter(
      (store) => !scannedStores.includes(store),
    );

    // If all stores have been scanned recently, return cached results
    if (storesToScan.length === 0) {
      this.logger.log('All stores already scanned. Returning cached results.');
      return results;
    }
    
    this.logger.log(`Scanning ${storesToScan.length} stores: ${storesToScan.join(', ')}`);
    
    // Create scan promises for only the stores that need scanning
    const scanPromises = storesToScan.map(async (store) => {
      try {
        switch (store) {
          case 'costco':
            return await this.costcoScanService.scan(sanitizedKeyword);
          case 'ashley':
            return await this.ashleyScanService.scan(sanitizedKeyword);
          case 'ikea':
            return await this.ikeaScanService.scan(sanitizedKeyword);
          case 'walmart':
            return await this.walmartScanService.scan(sanitizedKeyword);
          case 'livingSpaces':
            return await this.livingSpacesScanService.scan(sanitizedKeyword);
          case 'homedepot':
            return await this.homedepotScanService.scan(sanitizedKeyword);
          case 'wayfair':
            return await this.wayfairScanService.scan(sanitizedKeyword);
          default:
            this.logger.warn(`Unknown store: ${store}`);
            return [];
        }
      } catch (error) {
        this.logger.error(`Error scanning ${store}:`, error.message);
        return [];
      }
    });
    
    const scanResults = await Promise.allSettled(scanPromises);

    // Aggregate results from successful scans
    const newResults: Furniture[] = [];
    scanResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        newResults.push(...result.value);
      } else {
        this.logger.error(`Scan failed for ${storesToScan[index]}:`, result.reason);
      }
    });
    
    const totalResults = [...results, ...newResults];
    this.logger.log(
      `Scan completed. Found ${newResults.length} new items, ${totalResults.length} total items`,
    );
    
    return totalResults;
  }
}
