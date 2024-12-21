import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { PrismaService } from 'src/prisma.service';
import { SubcategoriesService } from 'src/subcategories/subcategories.service';
import { ObjectIdRegex } from 'src/utils/regex';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterResponseDto } from './dto/filters.dto';
import { FindAllProductsDto } from './dto/find-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ManufacturersService } from 'src/manufacturers/manufacturers.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubcategoriesService,
    private manufacturersService: ManufacturersService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    await this.prisma.product.create({ data: createProductDto });
    return createProductDto;
  }

  async findAll(filters: FindAllProductsDto) {
    const {
      page = 1,
      pageSize = 10,
      subCategoryIds,
      search,
      priceMin,
      priceMax,
      manufacturer,
      isAvailable,
      isUkrainian,
      type = 'all',
    } = filters;

    const where: any = {};

    if (subCategoryIds && subCategoryIds.length) {
      where.subCategories = {
        hasSome: subCategoryIds.split(','),
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (
      priceMin !== undefined &&
      priceMax !== undefined &&
      !isNaN(+priceMin) &&
      !isNaN(+priceMax)
    ) {
      where.price = { gte: +priceMin, lte: +priceMax };
    } else if (priceMin !== undefined && !isNaN(+priceMin)) {
      where.price = { gte: +priceMin };
    } else if (priceMax !== undefined && !isNaN(+priceMax)) {
      where.price = { lte: +priceMax };
    }

    if (manufacturer) {
      if (!ObjectIdRegex.test(manufacturer))
        throw new BadRequestException('Manufacturer must be a valid ID');
      where.manufacturer = manufacturer;
    }

    if (isAvailable !== undefined) {
      // @ts-ignore
      where.stockCount = isAvailable === 'true' ? { gte: 0 } : 0;
    }

    if (type === 'season') {
      where.isSeasonal = true;
    }

    if (isUkrainian !== undefined) {
      where.country =
        // @ts-ignore
        isUkrainian === 'true'
          ? { name: 'Ukraine', code: 'UA' }
          : { NOT: { name: 'Ukraine', code: 'UA' } };
    }

    const [products, count] = await this.prisma.$transaction(
      type === 'popular'
        ? [
            this.prisma.marketResearch.findMany({
              where,
              skip: (page - 1) * pageSize,
              take: +pageSize,
            }),
            this.prisma.marketResearch.count({
              where,
            }),
          ]
        : [
            this.prisma.product.findMany({
              where,
              skip: (page - 1) * pageSize,
              take: +pageSize,
            }),
            this.prisma.product.count({
              where,
            }),
          ],
    );

    const result = {
      data: products.map((product) => ({
        ...product,
        isAvailable: product.stockCount > 0,
        // @ts-ignore
        commentsCount: product.comments?.length ?? 0,
      })),
      total: count,
    };

    return result;
  }

  async findOne(id: string) {
    if (!ObjectIdRegex.test(id))
      throw new BadRequestException('Id is not valid');
    const product = await this.prisma.product.findFirst({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    const manufacturer = await this.manufacturersService.findById(
      product.manufacturer ?? '',
      {
        select: { id: true, companyName: true },
      },
    );
    return { ...product, manufacturer };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!ObjectIdRegex.test(id))
      throw new BadRequestException('Id is not valid');

    const product = await this.prisma.product.findFirst({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    const updatedProduct = await this.prisma.product.update({
      where: { id: id },
      data: updateProductDto,
    });
    return updatedProduct;
  }

  async remove(id: string) {
    if (!ObjectIdRegex.test(id))
      throw new BadRequestException('Id is not valid');

    const product = await this.prisma.product.findFirst({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.prisma.product.delete({ where: { id: id } });

    return `This action removes a #${id} product`;
  }

  async getFilters(): Promise<FilterResponseDto> {
    const allCategories = await this.categoriesService.findAll();
    const subCategories = await this.subCategoriesService.findAll();

    const categories = this.categoriesService.organizeCategories(
      allCategories,
      subCategories,
    );

    const manufacturersIds = await this.prisma.product
      .findMany({
        select: {
          manufacturer: true,
        },
        distinct: ['manufacturer'],
      })
      // @ts-ignore
      .then((products) => products.map((prod) => prod.manufacturer ?? ''));

    const manufacturers =
      await this.manufacturersService.findManufacturersByIds(manufacturersIds, {
        select: { id: true, companyName: true },
      });

    const priceRange = await this.prisma.product.aggregate({
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    });

    return {
      categories: categories,
      manufacturers: manufacturers,
      priceRange: {
        min: priceRange._min.price ?? 0,
        max: priceRange._max.price ?? 100000000,
      },
    };
  }

  async findProductsByIds(ids: string[]) {
    return this.prisma.product.findMany({
      where: { id: { in: ids } },
    });
  }

  async updateMany(updateOptions: Prisma.ProductUpdateManyArgs) {
    return this.prisma.product.updateMany(updateOptions);
  }
}
