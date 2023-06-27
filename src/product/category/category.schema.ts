import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as SoftDelete from 'mongoose-delete';

export type ProductCategoryDocument = ProductCategory & Document;

export enum CategoryStatusTypes {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema()
export class CategoryImage {
  _id?: Types.ObjectId;
  @Prop()
  uri: string;
}

@Schema()
export class ProductCategory {
  _id?: Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop()
  image: CategoryImage;
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);

ProductCategorySchema.plugin(SoftDelete, { deletedAt: true });

export const lookUpCategory = [
  {
    $lookup: {
      from: 'categories',
      foreignField: '_id',
      localField: 'categoryId',
      as: 'category',
    },
  },
  { $unwind: '$category' },
];

export class PageResult<T> {
  totalRecords: number;
  data: Array<T>;
}

export class PageParams {
  skip?: number;
  take?: number;
  keyword?: string;
  status?: string;
  isUnique?: boolean;
  isRoot?: boolean;
}

export const handlePageFacet = (page: PageParams) => {
  return {
    $facet: {
      data: [{ $skip: Number(page.skip) }, { $limit: Number(page.take) }],
      totalRecords: [{ $count: 'count' }],
    },
  };
};

export const handlePageResult = (res: any) => {
  let rs = res[0] as any;
  if (rs.totalRecords.length)
    rs = { ...rs, totalRecords: rs.totalRecords[0].count };
  else rs = { ...rs, totalRecords: 0 };

  return rs;
};
