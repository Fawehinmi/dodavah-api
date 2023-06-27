import { Injectable, Logger } from '@nestjs/common';
import { ProductCategoryRepository } from './category.repository';
import { PageParams, PageResult, ProductCategory } from './category.schema';

@Injectable()
export class ProductCategoryService {
  private readonly logger = new Logger(ProductCategoryService.name);
  constructor(
    private readonly productCategoryRepo: ProductCategoryRepository,
  ) {}

  create = async (model: ProductCategory) => {
    return this.productCategoryRepo.create(model);
  };

  update = async (
    id: string,
    model: Partial<ProductCategory>,
  ): Promise<ProductCategory> => {
    const category = await this.productCategoryRepo.findById(id);
    if (!category) throw new Error('Category not found');
    return await this.productCategoryRepo.update(id, model);
  };

  delete = async (id: string): Promise<Boolean> => {
    await this.productCategoryRepo.delete(id);
    return true;
  };

  findById = async (id: string): Promise<ProductCategory> => {
    return await this.findOne({ _id: id } as any);
  };

  find = async (
    category: Partial<ProductCategory>,
  ): Promise<ProductCategory[]> => {
    return await this.productCategoryRepo.find(category);
  };

  findOne = async (
    query: Partial<ProductCategory>,
  ): Promise<ProductCategory> => {
    return await this.productCategoryRepo.findOne(query);
  };

  page = async (page: PageParams): Promise<PageResult<ProductCategory>> => {
    const rs = await this.productCategoryRepo.page(page);

    return rs;
  };
}
