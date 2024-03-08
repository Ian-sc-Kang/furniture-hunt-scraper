import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Furniture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  searchKeyword: string;

  @Column()
  name: string;

  @Column()
  price: string;

  @Column()
  imageUrl: string;

  @Column({ type: 'text' })
  productLink: string;

  @Column()
  storeName: string;

  @Column()
  scrapedAt: Date;

  constructor(args: {
    searchKeyword: string;
    name: string;
    price: string;
    imageUrl: string;
    productLink: string;
    storeName: string;
  }) {
    if (args) {
      const { name, price, imageUrl, productLink, storeName } = args;
      this.searchKeyword = args.searchKeyword;
      this.name = name;
      this.price = price;
      this.imageUrl = imageUrl;
      this.productLink = productLink;
      this.storeName = storeName;
      this.scrapedAt = new Date();
    }
  }
}
