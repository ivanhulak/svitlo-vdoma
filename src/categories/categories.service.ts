import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, SubCategory } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    await this.prisma.category.create({ data: createCategoryDto });
    return createCategoryDto;
  }

  async findAll() {
    const categories = await this.prisma.category.findMany();
    return categories;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id: id },
    });
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: { id: id },
      data: updateCategoryDto,
    });
    return category;
  }

  async remove(id: string) {
    await this.prisma.category.delete({ where: { id: id } });
    return `This action removes a #${id} category`;
  }

  organizeCategories(categories: Category[], subCategories: SubCategory[]) {
    const subCategoryMap: {
      [key: string]: SubCategory & { productsCount: number };
    } = {};
    subCategories.forEach((subCategory) => {
      subCategoryMap[subCategory.id] = {
        ...subCategory,
        productsCount: subCategory.products?.length ?? 0,
      };
    });

    return categories.map((category) => {
      const { id, name, subCategories } = category;
      const organizedCategory: Partial<Category> = {
        id,
        name,
        subCategoriesArray: (subCategories ?? []).map(
          (subCategoryId) => subCategoryMap[subCategoryId],
        ),
      };
      return organizedCategory;
    });
  }
}
