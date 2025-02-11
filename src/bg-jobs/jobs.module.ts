import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsProcessor } from './jobs.processor';
import { ProductsModule } from '../products/products.module';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'products',
    }),
    TypeOrmModule.forFeature([Product]),
    ProductsModule
  ],
  providers: [JobsService, JobsProcessor],
  exports: [JobsService],
})
export class JobsModule {}