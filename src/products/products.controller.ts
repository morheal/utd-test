import { Controller, Get, Query, Post, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService
  ) {}

  @Post('import')
  @ApiOperation({ summary: 'Import all products from dummyjson api with transaction' })
  async parse() {
    console.log('importing products');
    try {
      this.productsService.fetchAllProducts();
      
      return { message: 'Products are being imported' };
    }
    catch (error) {
      console.log(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit the number of products' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Skip the number of products' })
  @ApiQuery({ name: 'title', required: false, type: String, description: 'Search by product title' })
  findAll(@Query('limit') limit: number = 30, @Query('skip') skip: number = 0,  @Query('title') title: string) {
    console.log(title);
    return this.productsService.findAll(limit, skip, {title});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'Product ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
}
