import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/product/product.dto';
@ObjectType()
export class CartItem {
  @Field((type) => ID)
  _id: string;
  @Field((type) => ID)
  productId: string;
  @Field()
  quantity: number;
  @Field()
  price: number;
  @Field({ nullable: true })
  totalAmount: Number;
  @Field()
  product: Product;
}
@ObjectType()
export class Cart {
  @Field((type) => Number, { nullable: true })
  tax: number;
  @Field((type) => Number, { nullable: true })
  subTotal: number;
  @Field((type) => Number, { nullable: true })
  totalPrice: number;
  @Field((type) => [CartItem], { nullable: true })
  items: CartItem[];
}

@InputType()
export class CartItemInput {
  @Field((type) => Number, { nullable: true })
  quantity: number;
}

@InputType()
export class AddItemInput extends CartItemInput {
  @Field((type) => String)
  productId: number;
}
