import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  CreateProductCategoryInput,
  ProductCategory,
  ProductCategoryPageInput,
  ProductCategoryPageResult,
  ProductCategoryQueryInput,
  UpdateProductCategoryInput,
} from './category.dto';
import { ProductCategoryService } from './category.service';
import { FileUploader } from 'src/utils/cloudinary';

@Resolver((of) => ProductCategory)
export class ProductCategoryResolver {
  constructor(
    private readonly productCatSvc: ProductCategoryService,
    private readonly fileUpload: FileUploader,
  ) {}

  @Mutation((returns) => ProductCategory, { name: 'createProductCategory' })
  async createProductCategory(
    @Args('category') category: CreateProductCategoryInput,
  ) {
    const file = await this.fileUpload._saveFile(
      category.file.base64Str,
      category.file.filename,
      category.file.filetype,
    );

    return await this.productCatSvc.create({
      ...category,
      image: { uri: file },
    } as any);
  }

  @Mutation((returns) => ProductCategory, { name: 'updateProductCategory' })
  async updateProductCategory(
    @Args('id') id: string,
    @Args('category') category: UpdateProductCategoryInput,
  ) {
    const file = await this.fileUpload._saveFile(
      category.file.base64Str,
      category.file.filename,
      category.file.filetype,
    );
    return await this.productCatSvc.update(id, {
      ...category,
      image: { uri: file },
    } as any);
  }

  @Query((returns) => ProductCategory, { name: 'findProductCategory' })
  async findProductCategory(@Args('query') query: ProductCategoryQueryInput) {
    return await this.productCatSvc.findOne(query as any);
  }

  @Query((returns) => ProductCategoryPageResult, {
    name: 'productCategoryPage',
  })
  async productCategoryPage(@Args('page') page: ProductCategoryPageInput) {
    const rs = await this.productCatSvc.page({
      ...page,
    });
    return rs;
  }

  @Mutation((returns) => Boolean, { name: 'deleteProductCategory' })
  async deleteProductCategory(@Args('id') id: string) {
    return await this.productCatSvc.delete(id);
  }
}
