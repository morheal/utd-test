// filepath: /Users/admin/work/utd_test/products-parser/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { JobsModule } from './bg-jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Product],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProductsModule,
    JobsModule,
  ],
})
export class AppModule {}