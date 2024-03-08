import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Furniture } from './furniture.entity';
import { Raw, Repository } from 'typeorm';

@Injectable()
export class FurnitureService {
  constructor(
    @InjectRepository(Furniture)
    private furnitureRepository: Repository<Furniture>,
  ) {}

  async findAllByKeyword(
    keyword: string,
    stores: string[],
  ): Promise<Furniture[]> {
    const offsetDate = new Date();
    offsetDate.setDate(offsetDate.getDate() - 1);

    const findOption = stores.map((store) => ({
      searchKeyword: keyword,
      storeName: store,
      scrapedAt: Raw((alias) => `${alias} >= :dateTime`, {
        dateTime: offsetDate,
      }),
    }));
    return await this.furnitureRepository.find({
      where: findOption,
    });
  }

  async isKeywordScannedBefore(
    storeName: string,
    keyword: string,
    seconds: number,
  ): Promise<boolean> {
    const furniture = await this.furnitureRepository.findOne({
      where: { searchKeyword: keyword, storeName: storeName },
      order: { scrapedAt: 'DESC' },
    });

    if (!furniture) {
      return false;
    }

    const now = new Date();
    const diff = now.getTime() - furniture.scrapedAt.getTime();
    const diffSeconds = diff / 1000;

    return diffSeconds < seconds;
  }

  async findAll(): Promise<Furniture[]> {
    return await this.furnitureRepository.find();
  }

  async findOne(id: number): Promise<Furniture> {
    return await this.furnitureRepository.findOne({ where: { id } });
  }

  async remove(furniture: Furniture): Promise<void> {
    await this.furnitureRepository.remove(furniture);
  }

  async save(furnitures: Furniture[]): Promise<Furniture[]> {
    return await this.furnitureRepository.save(furnitures);
  }
}
