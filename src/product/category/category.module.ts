import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { FileUploader } from 'src/utils/cloudinary';
import { ProductCategoryRepository } from './category.repository';
import { ProductCategoryResolver } from './category.resolver';
import { ProductCategory, ProductCategorySchema } from './category.schema';
import { ProductCategoryService } from './category.service';
@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: ProductCategory.name, schema: ProductCategorySchema },
    ]),
  ],
  providers: [
    ProductCategoryService,
    ProductCategoryRepository,
    ProductCategoryResolver,
    FileUploader,
  ],
  exports: [ProductCategoryService, ProductCategoryRepository],
})
export class ProductCategoryModule {}
