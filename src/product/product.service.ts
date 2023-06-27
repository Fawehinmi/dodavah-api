import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { env } from 'process';

import { ProductRepository } from './product.repository';
import { PageParams, PageResult, Product } from './product.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly configSvc: ConfigService,
  ) {}

  create = async (model: Product): Promise<Product> => {
    const createdProduct = await this.productRepo.create({
      ...model,
    });

    return await this.productRepo.findById(createdProduct._id.toString());
  };

  update = async (id: string, model: Partial<Product>): Promise<Product> => {
    const product = await this.productRepo.findById(id);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    return await this.productRepo.update(id, {
      ...model,
    });
  };

  delete = async (id: string): Promise<Boolean> => {
    await this.productRepo.delete(id);
    return true;
  };

  findById = async (id: string): Promise<Product> => {
    return await this.productRepo.findById(id);
  };

  findOne = async (query: Partial<Product>): Promise<Product> => {
    return await this.productRepo.findOne(query);
  };
  page = async (page: PageParams): Promise<PageResult<Product>> => {
    return await this.productRepo.page(page).then(async (rs) => {
      return {
        ...rs,
        result: rs.data,
      } as any;
    });
  };
}
