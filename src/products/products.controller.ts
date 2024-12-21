import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FindAllProductsDto } from './dto/find-products.dto';
import { FilterResponseDto } from './dto/filters.dto';
import { ObjectIdRegex } from 'src/utils/regex';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('by-ids')
  @ApiOkResponse({
    description: 'Return products by ids',
    type: Array<CreateProductDto>,
  })
  async getProductsByIds(@Query('ids') ids: string[]) {
    const productIds = Array.isArray(ids) ? ids : [ids];
    const validIds = productIds.filter((id) => ObjectIdRegex.test(id));

    if (validIds.length === 0) {
      throw new BadRequestException(
        'No valid ObjectId format provided in ids.',
      );
    }
    return this.productsService.findProductsByIds(validIds);
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateProductDto,
  })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Return products',
    type: Array<CreateProductDto>,
  })
  async findAll(@Query() filters: FindAllProductsDto) {
    const products = await this.productsService.findAll(filters);
    return products;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
  @Get('filters')
  @ApiOkResponse({
    description: 'Return product filters',
    type: FilterResponseDto,
  })
  async getFilters() {
    return this.productsService.getFilters();
  }
  @Get(':id')
  @ApiOkResponse({
    description: 'Return product data',
    type: CreateProductDto,
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
