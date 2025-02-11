import axios from 'axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectQueue('products') private readonly productsQueue: Queue,
    private dataSource: DataSource
  ) {}

  async fetchProducts(skip: number = 0, limit: number = 30) {
    const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
    const products = response.data.products;

    await this.productRepository.save(products);

    return response.data;
  }

  async fetchAllProducts() {
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        this.removeAll();
      
        const initRequest: any = await this.fetchProducts()
        
        for (let i = 30; i < initRequest.total; i += 30) {
          if( i + 30 > initRequest.total) {
            this.addFetchProductsJob({skip: i, limit: initRequest.total - i});
          } else {
            this.addFetchProductsJob({skip: i, limit: 30});
          }
        }
      } catch (e) {
        await queryRunner.rollbackTransaction();
        throw e;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      throw new Error(`Failed to start a transaction: ${error.message}`);
    }
  }

  async addFetchProductsJob(data: { skip: number; limit: number }) {
    await this.productsQueue.add('fetchProducts', data);
  }

  findAll(limit: number = 30, skip: number = 0, search: { title: string } ) {
    const query = this.productRepository.createQueryBuilder('product')
      .take(limit)
      .skip(skip)
      .orderBy('product.id', 'ASC');

    if (search?.title) {
      query.andWhere('product.title ILIKE :title', { title: `%${search.title}%` });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  removeAll() {
    return this.productRepository.clear();
  }
}
