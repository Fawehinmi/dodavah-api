import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartItemDocument = CartItem & Document;

@Schema()
export class CartItem {
  _id?: Types.ObjectId;
  @Prop({ required: true })
  userId: Types.ObjectId;
  @Prop({ required: true })
  productId: Types.ObjectId;
  @Prop({ default: 1 })
  quantity: number;
}

export interface UserCart {
  items: CartItem[];
  totalAmount: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
