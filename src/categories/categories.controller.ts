import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SubcategoriesService } from 'src/subcategories/subcategories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly subCategoriesService: SubcategoriesService,
  ) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Return user data',
    type: Array<CreateCategoryDto>,
  })
  async findAll() {
    const categories = await this.categoriesService.findAll();
    const subCategories = await this.subCategoriesService.findAll();

    return this.categoriesService.organizeCategories(categories, subCategories);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Return user data',
    type: CreateCategoryDto,
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
