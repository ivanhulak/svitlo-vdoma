import { CreateSubcategoryDto } from 'src/subcategories/dto/create-subcategory.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';

export class Category extends CreateCategoryDto {
  id: string;
  subCategoriesArray?: SubCategory[];
}

export interface SubCategory extends Partial<CreateSubcategoryDto> {
  id: string;
}
