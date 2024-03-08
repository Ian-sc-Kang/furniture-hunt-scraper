import { Furniture } from 'src/services/furniture/furniture.entity';

export abstract class ShopScanService {
  abstract readonly homeUrl: string;
  abstract scan(keyword: string): Promise<Furniture[]>;
}
