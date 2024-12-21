import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SubcategoriesModule } from 'src/subcategories/subcategories.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
  imports: [SubcategoriesModule],
  exports: [CategoriesService],
})
export class CategoriesModule {}
