import { Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubcategoriesService {
  constructor(private prisma: PrismaService) {}
  async create(createSubcategoryDto: CreateSubcategoryDto) {
    await this.prisma.subCategory.create({ data: createSubcategoryDto });
    return createSubcategoryDto;
  }

  async findAll() {
    const subCategories = await this.prisma.subCategory.findMany();
    return subCategories;
  }

  async findOne(id: string) {
    const subCategory = await this.prisma.subCategory.findFirst({
      where: { id: id },
    });
    return subCategory;
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    const category = await this.prisma.subCategory.update({
      where: { id: id },
      data: updateSubcategoryDto,
    });
    return category;
  }

  async remove(id: string) {
    await this.prisma.subCategory.delete({ where: { id: id } });
    return `This action removes a #${id} subcategory`;
  }

  async findByCategory(id: string) {
    const subCategories = await this.prisma.subCategory.findMany({
      where: { categoryId: id },
    });
    return subCategories;
  }
}
