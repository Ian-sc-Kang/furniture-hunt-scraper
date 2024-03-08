import { Module } from '@nestjs/common';
import { FurnitureService } from './furniture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Furniture } from './furniture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Furniture])],
  controllers: [],
  providers: [FurnitureService],
  exports: [FurnitureService],
})
export class FurnitureModule {}
