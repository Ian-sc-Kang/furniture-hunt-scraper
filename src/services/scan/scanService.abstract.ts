import { Furniture } from 'src/services/furniture/furniture.entity';

/**
 * Abstract base class for individual store scan services
 * Each store implementation must extend this class
 */
export abstract class ShopScanService {
  /**
   * The base URL for the store's website
   */
  abstract readonly homeUrl: string;

  /**
   * Scans the store for furniture items matching the given keyword
   *
   * @param keyword - The search term to look for
   * @returns Promise<Furniture[]> - Array of furniture items found in this store
   */
  abstract scan(keyword: string): Promise<Furniture[]>;
}
