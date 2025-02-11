import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class JobsService {
  constructor(@InjectQueue('products') private readonly productsQueue: Queue) {}

  async addProductJob(data: { skip: number; limit: number }) {
    await this.productsQueue.add('processProduct', data);
  }
}