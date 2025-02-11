import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @ApiProperty({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851', description: 'The unique identifier of the product' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Product Title', description: 'The title of the product' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Product Description', description: 'The title of the product' })
  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column('decimal')
  price: number;

  @Column('decimal')
  discountPercentage: number;

  @Column('decimal')
  rating: number;

  @Column()
  stock: number;

  @Column('simple-array')
  tags: string[];

  @Column({ nullable: true })
  brand: string;

  @Column()
  sku: string;

  @Column('decimal')
  weight: number;

  @Column('json')
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };

  @Column('text')
  warrantyInformation: string;

  @Column('text')
  shippingInformation: string;

  @Column()
  availabilityStatus: string;

  @Column('json')
  reviews: {
    rating: number;
    comment: string;
    date: Date;
    reviewerName: string;
    reviewerEmail: string;
  }[];

  @Column('text')
  returnPolicy: string;

  @Column()
  minimumOrderQuantity: number;

  @Column('json')
  meta: {
    createdAt: Date;
    updatedAt: Date;
    barcode: string;
    qrCode: string;
  };

  @Column()
  thumbnail: string;

  @Column('simple-array')
  images: string[];
}