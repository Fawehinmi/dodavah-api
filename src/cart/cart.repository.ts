import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CartItem, CartItemDocument, UserCart } from './cart.schema';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(CartItem.name) private cartModel: Model<CartItemDocument>,
  ) {}

  async create(model: CartItem): Promise<CartItem> {
    return await this.cartModel.create({
      ...model,
      productId: new Types.ObjectId(model.productId),
      userId: new Types.ObjectId(model.userId),
    });
  }

  async update(id: string, model: Partial<CartItem>): Promise<CartItem> {
    return (await this.cartModel.updateOne(
      { _id: new Types.ObjectId(id) },
      {
        ...model,
      },
    )) as any;
  }

  delete = async (id: string): Promise<void> => {
    await this.cartModel.deleteOne({ _id: new Types.ObjectId(id) });
  };
  find = async (query: Partial<CartItem>): Promise<CartItem[]> => {
    if (query._id) query._id = new Types.ObjectId(query._id);
    if (query.userId) query.userId = new Types.ObjectId(query.userId);
    return await this.cartModel.find(query);
  };

  findOne = async (query: Partial<CartItem>): Promise<CartItem> => {
    if (query._id) query._id = new Types.ObjectId(query._id);
    return await this.cartModel.findOne(query);
  };

  findUserCart = async (item: Partial<CartItem>): Promise<UserCart> => {
    let query = {
      $match: {},
    } as any;

    if (item.userId) {
      query.$match.$and = query.$match.$and || [];
      query.$match.$and.push({ userId: new Types.ObjectId(item.userId) });
    }

    return await this.cartModel
      .aggregate([
        query,
        {
          $addFields: { totalAmount: { $multiply: ['$price', '$quantity'] } },
        },
      ])
      .then((rs) => {
        return { items: rs, totalAmount: 0 };
      });
  };

  clear = async (query: Partial<CartItem>): Promise<void> => {
    if (query.userId) query.userId = new Types.ObjectId(query.userId);
    await this.cartModel.deleteMany(query);
  };
}
