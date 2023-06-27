import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { helper } from 'src/helper';
// import { helper } from 'src/core';
import {
  handlePageFacet,
  handlePageResult,
  PageParams,
  PageResult,
  ProductCategory,
  ProductCategoryDocument,
} from './category.schema';

@Injectable()
export class ProductCategoryRepository {
  constructor(
    @InjectModel(ProductCategory.name)
    private productCategoryModel: SoftDeleteModel<ProductCategoryDocument>,
  ) {}

  async create(model: ProductCategory): Promise<ProductCategory> {
    const createdCategory = new this.productCategoryModel({
      ...model,
      createdAt: Date.now(),
    });
    return createdCategory.save();
  }

  async update(
    id: string,
    model: Partial<ProductCategory>,
  ): Promise<ProductCategory> {
    await this.productCategoryModel.updateOne(
      { _id: id },
      {
        ...model,
        updatedAt: Date.now(),
      },
    );
    return this.findById(id);
  }

  delete = async (id: string): Promise<void> => {
    await this.productCategoryModel.deleteOne({ _id: new Types.ObjectId(id) });
  };

  find = async (
    query: Partial<ProductCategory>,
  ): Promise<Array<ProductCategory>> => {
    return await this.productCategoryModel.find(query);
  };

  findOne = async (query: Partial<ProductCategory>) => {
    if (query._id) query._id = new Types.ObjectId(query._id);

    return await this.productCategoryModel.findOne(query);
  };

  findById = async (id: string) => {
    return await this.productCategoryModel.findById(id);
  };

  page = async (page: PageParams): Promise<PageResult<ProductCategory>> => {
    let query = {
      $match: {},
    } as any;

    if (page.keyword) {
      query.$match.$and = query.$match.$and || [];
      query.$match.$and.push({
        $or: [
          {
            name: {
              $regex: helper.removeSpecialChar(page.keyword),
              $options: 'si',
            },
          },
        ],
      });
    }

    if (page.isRoot !== undefined && page.isRoot !== null) {
      query.$match.$and = query.$match.$and || [];
      query.$match.$and.push({ parentId: { $exists: false } });
    }

    return await this.productCategoryModel
      .aggregate([query, { $sort: { name: 1 } }, { ...handlePageFacet(page) }])
      .then(handlePageResult);
  };
}
