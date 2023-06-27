import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class ProductImage {
  _id?: Types.ObjectId;
  @Prop()
  uri: string;
  @Prop()
  name: string;
  @Prop()
  type: string;
}

@Schema()
export class Product {
  _id: Types.ObjectId;
  @Prop()
  name: string;
  @Prop()
  category: string;
  @Prop()
  quantity: number;
  @Prop()
  detail: string;
  @Prop()
  categoryId: Types.ObjectId;
  @Prop()
  priceBefore: number;
  @Prop()
  price: number;
  @Prop({ default: Date.now() })
  createdAt: Date;
  @Prop({ default: Date.now() })
  updateAt: Date;

  @Prop()
  images: Array<ProductImage>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export class PageParams {
  skip?: number;
  take?: number;
  keyword?: string;
  status?: string;

  category?: string;
  categoryId?: string;
}
export class PageResult<T> {
  totalRecords: number;
  data: Array<T>;
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
