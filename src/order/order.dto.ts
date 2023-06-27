import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { OrderStatus } from './order.schema';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});
@InputType()
export class CheckoutInput {
  @Field((type) => String)
  address: String;
  @Field((type) => String)
  email: String;
  @Field((type) => String)
  contactPhone: String;
  @Field((type) => String)
  contactName: String;
}
@ObjectType()
export class OrderProductImage {
  @Field((type) => String, { nullable: true })
  _id: string;
  @Field((type) => String, { nullable: true })
  uri: string;
  @Field((type) => String, { nullable: true })
  name: string;
  @Field((type) => String, { nullable: true })
  type: string;
}

@ObjectType()
export class OrderProduct {
  @Field((type) => String)
  _id: string;
  @Field((type) => [OrderProductImage])
  images: [OrderProductImage];
  @Field((type) => String, { nullable: true })
  category: string;
  @Field((type) => String)
  name: string;
  @Field((type) => String)
  detail: string;
}

@ObjectType()
export class OrderItem {
  @Field((type) => String)
  _id?: string;
  @Field((type) => OrderProduct)
  product: OrderProduct;
  @Field((type) => String)
  quantity: number;
  @Field((type) => String)
  price: number;
  @Field((type) => String)
  totalAmount: Number;
}

@ObjectType()
export class Order {
  @Field((type) => String, { nullable: true })
  _id: string;
  @Field((type) => String, { nullable: true })
  ref: string;

  @Field((type) => String, { nullable: true })
  userId: string;

  @Field((type) => OrderStatus, { nullable: true })
  status: OrderStatus;
  @Field((type) => [OrderItem], { nullable: true })
  items: [OrderItem];
  @Field((type) => Number, { nullable: true })
  tax: number;
  @Field((type) => Number, { nullable: true })
  subTotal: number;
  @Field((type) => Number, { nullable: true })
  totalPrice: number;

  @Field((type) => String, { nullable: true })
  contactPhone: string;

  @Field((type) => String, { nullable: true })
  address: string;
  @Field((type) => String, { nullable: true })
  createdAt: string;
  @Field((type) => String, { nullable: true })
  contactName: string;
}

@InputType()
export class OrderPageInput {
  @Field()
  skip: number;
  @Field()
  take: number;
  @Field((type) => Number, { nullable: true })
  endDate: number;
  @Field((type) => Number, { nullable: true })
  startDate: number;
  @Field((type) => String, { nullable: true })
  keyword: string;
}
@ObjectType()
export class OrderPageResult {
  @Field()
  totalRecords: number;
  @Field((type) => [Order])
  data: [Order];
}
