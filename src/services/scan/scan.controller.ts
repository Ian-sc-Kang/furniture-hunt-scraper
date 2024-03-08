import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ScanService } from './scan.service';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';

@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}
  @Get()
  @UseInterceptors(LoggingInterceptor)
  async scan(@Query('search') keyword: string) {
    return await this.scanService.scan(keyword);
  }
}
