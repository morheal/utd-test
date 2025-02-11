import axios from 'axios';
import { Injectable } from '@nestjs/common';
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
    console.log('requesting products with limit:', limit, 'skip:', skip);
    const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
    const products = response.data.products;

    console.log(response.data.products.length)

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
        console.log("TOTAL: ",initRequest.total);
        console.log(initRequest);
        
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
    console.log('add job to queue limit:', data.limit, 'skip:', data.skip);
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

  findOne(id: number) {
    return this.productRepository.findOneBy({id});
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  removeAll() {
    console.log('delete all products');
    return this.productRepository.clear();
  }
}
