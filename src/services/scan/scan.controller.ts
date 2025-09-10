import {
  Controller,
  Get,
  Query,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ScanService } from './scan.service';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';

/**
 * Controller for handling furniture scanning requests
 */
@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  /**
   * Scans multiple furniture stores for products matching the search keyword
   *
   * @param keyword - Search term for furniture items
   * @returns Array of furniture items from various stores
   * @example GET /scan?search=chair
   */
  @Get()
  @UseInterceptors(LoggingInterceptor)
  async scan(@Query('search') keyword: string) {
    if (!keyword || keyword.trim().length === 0) {
      throw new BadRequestException('Search keyword is required');
    }

    if (keyword.length > 100) {
      throw new BadRequestException(
        'Search keyword is too long (max 100 characters)',
      );
    }

    return await this.scanService.scan(keyword);
  }
}
