import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ProductsService } from '../products/products.service';

@Processor('products')
export class JobsProcessor {
    constructor(private readonly productsService: ProductsService) {}

    @Process('fetchProducts')
    async handleFetchProducts(job: Job) {
        try {
            console.log('Fetching products...:', job.data);
            const { skip, limit } = job.data;
            await this.productsService.fetchProducts(skip, limit);
        } catch (error) {
            console.log(error);
        }
    }
}