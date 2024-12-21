import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { ManufacturersModule } from 'src/manufacturers/manufacturers.module';
import { PrismaService } from 'src/prisma.service';
import { SubcategoriesModule } from 'src/subcategories/subcategories.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [CategoriesModule, SubcategoriesModule, ManufacturersModule],
  exports: [ProductsService],
})
export class ProductsModule {}
