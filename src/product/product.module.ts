import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils/forward-ref.util';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { FileUploader } from 'src/utils/cloudinary';
import { ProductCategoryModule } from './category/category.module';
import { ProductRepository } from './product.repository';
import { ProductResolver } from './product.resolver';
import { Product, ProductSchema } from './product.schema';
import { ProductService } from './product.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ConfigModule,
    forwardRef(() => ProductCategoryModule),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [ProductService, ProductRepository, ProductResolver, FileUploader],
  exports: [ProductService],
})
export class ProductModule {}
