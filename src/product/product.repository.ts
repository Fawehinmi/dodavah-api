import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';

import {
  ProductDocument,
  Product,
  PageParams,
  PageResult,
  handlePageResult,
  handlePageFacet,
} from './product.schema';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async create(model: Product): Promise<Product> {
    const createproduct = new this.productModel({
      ...model,
      categoryId: new Types.ObjectId(model.categoryId),
      createdAt: Date.now(),
    });
    return createproduct.save();
  }

  async update(id: string, model: Partial<Product>): Promise<Product> {
    if (model.categoryId) {
      model.categoryId = new Types.ObjectId(model.categoryId);
    }
    await this.productModel.updateOne({ _id: id }, model);

    return this.findOne({ _id: new Types.ObjectId(id) });
  }

  delete = async (id: string): Promise<void> => {
    await this.productModel.deleteOne({ _id: new Types.ObjectId(id) });
  };

  findOne = async (query: Partial<Product>) => {
    return await this.productModel.findOne(query);
  };
  findById = async (id: string) => {
    return await this.productModel.findById(new Types.ObjectId(id));
  };

  // async count(query: Partial<Product>): Promise<number> {
  //   return this.productModel.count(query);
  // }

  // findById = async (id: string) => {
  //   // return await this.productModel.findById(new Types.ObjectId(id));
  //   return await this.productModel
  //     .aggregate([...$storeLookup, { $match: { _id: new Types.ObjectId(id) } }])
  //     .then((rs) => (rs ? rs[0] : null));
  // };

  findByCategory = async (categoryId: string): Promise<Array<Product>> => {
    return await this.productModel.find({
      categoryId: new Types.ObjectId(categoryId),
    });
  };

  page = async (page: PageParams): Promise<PageResult<Product>> => {
    let query = {
      $match: {},
    } as any;

    let sort = { $sort: { indexNumber: 1 } } as any;

    if (page.keyword) {
      query.$match.$and = query.$match.$and || [];
      query.$match.$and.push({
        $or: [
          {
            name: new RegExp(`^${page.keyword}`, 'i'),
          },
        ],
      });
    }

    if (page.status) {
      query.$match.$and = query.$match.$and || [];
      query.$match.$and.unshift({
        status: page.status,
      });
    }

    if (page.categoryId) {
      query.$match.$and = query.$match.$and || [];
      query.$match.$and.unshift({
        categoryId: new Types.ObjectId(page.categoryId),
      });
    }

    return await this.productModel
      .aggregate([query, { ...handlePageFacet(page) }])
      .then(handlePageResult)
      .then((rs) => {
        return rs;
      });
  };
}
