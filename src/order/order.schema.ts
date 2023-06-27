import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  NEW = 'NEW',
  PAID = 'PAID',
  CONFIRMED = 'CONFIRMED',
  PACKED = 'PACKED',
  SENDOUT = 'SENDOUT',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export class OrderProductImage {
  _id?: Types.ObjectId;
  @Prop()
  uri: string;
  @Prop()
  name: string;
  @Prop()
  type: string;
}

export class OrderProduct {
  _id?: Types.ObjectId;
  @Prop()
  images: Array<OrderProductImage>;
  @Prop()
  category: string;
  @Prop()
  name: string;
  @Prop()
  detail: string;
}

export class OrderItem {
  _id?: Types.ObjectId;
  @Prop({})
  product: OrderProduct;
  @Prop({})
  quantity: number;
  @Prop({})
  price: number;
  @Prop({})
  totalAmount: Number;
}
export interface CheckoutInput {
  address: string;
  email: string;
  contactPhone: string;
  contactName: string;
}

@Schema()
export default class Order {
  _id?: Types.ObjectId;
  @Prop({ required: true, unique: true })
  ref: string;
  @Prop({})
  address: string;
  @Prop({})
  hashedPaymentRef: string;
  @Prop({})
  email: string;
  @Prop({})
  contactPhone: string;
  @Prop({})
  userId: Types.ObjectId;
  @Prop({})
  contactName: string;
  @Prop({ default: Date.now() })
  createdAt: number;
  @Prop({ default: 0 })
  subTotal: number;
  @Prop({ default: 0 })
  tax: number;
  @Prop({ default: 0 })
  totalPrice: number;
  @Prop({ _id: true })
  items: Array<OrderItem>;
  @Prop({ default: OrderStatus.NEW })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export class PageParams {
  skip?: number;
  take?: number;
  keyword?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
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

export const nextOrderCode = async (): Promise<string> => {
  const currentDate = new Date();

  const code = `${currentDate.getDate()}${
    currentDate.getMonth() + 1
  }${currentDate.getFullYear()}-${new Date().getTime().toString().slice(-5)}`;
  return code;
};
