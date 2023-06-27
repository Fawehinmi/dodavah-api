import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { model, Types } from 'mongoose';
import { GqlAuthorize, GqlCurrentUser } from 'src/auth/decorators';
import { Role } from 'src/enum';
import { FileUploader } from 'src/utils/cloudinary';
import { ProductCategoryService } from './category/category.service';

import {
  CreateProductInput,
  Product,
  ProductPageInput,
  ProductPageResult,
  UpdateProductInput,
} from './product.dto';
import { ProductService } from './product.service';

@Resolver((of) => Product)
export class ProductResolver {
  constructor(
    private readonly productSvc: ProductService,
    private readonly catSvc: ProductCategoryService,
    private readonly fileUpload: FileUploader,
  ) {}

  @ResolveField()
  async category(product: Product) {
    const rs = await this.catSvc.findById(product.categoryId);
    return rs?.name;
  }
  @Mutation((returns) => Product, { name: 'createProduct' })
  @GqlAuthorize([Role.SuperAdmin])
  async create(
    @GqlCurrentUser() user: any,
    @Args('product') product: CreateProductInput,
  ) {
    let files = await this.fileUpload.mapFiles(product.files);

    return await this.productSvc.create({
      ...product,
      images: files,
    } as any);
  }

  @Mutation((returns) => Product, { name: 'updateProduct' })
  @GqlAuthorize([Role.SuperAdmin])
  async update(
    @Args('id') id: string,
    @Args('product') product: UpdateProductInput,
  ) {
    let files = await this.fileUpload.mapFiles(product.files);

    return await this.productSvc.update(id, {
      ...product,
      images: files,
    } as any);
  }

  @Query((returns) => Product, { name: 'productDetail' })
  async productDetail(@Args('id') id: string) {
    return await this.productSvc.findById(id);
  }

  @Mutation((returns) => Boolean, { name: 'deleteProduct' })
  @GqlAuthorize([Role.SuperAdmin])
  async deleteProduct(@Args('id') id: string) {
    return await this.productSvc.delete(id);
  }
  @Query((returns) => ProductPageResult, { name: 'productPage' })
  async page(
    @Args('page')
    page: ProductPageInput,
    @GqlCurrentUser() user: any,
  ) {
    return await this.productSvc.page({
      ...page,
    });
  }

  // @Query((returns) => Product, { name: 'findProduct' })
  // async findProduct(@Args('query') query: ProductQueryInput) {
  //   return await this.productSvc.findOne(query);
  // }

  @Query((returns) => Product, { name: 'findProductById' })
  async findOne(@Args('id') id: string) {
    return this.productSvc.findById(id);
  }
}
