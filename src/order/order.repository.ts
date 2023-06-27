import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import { Model, Types } from 'mongoose';

import Order, {
  handlePageFacet,
  handlePageResult,
  OrderDocument,
  PageParams,
  PageResult,
} from './order.schema';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  create = async (order: Order): Promise<Order> => {
    if (order?.userId) order.userId = new Types.ObjectId(order.userId);
    return await this.orderModel.create(order);
  };

  // delete = async (id: string): Promise<void> => {
  //   await this.orderModel.deleteOne({ _id: new Types.ObjectId(id) });
  // };

  findOne = async (query: Partial<Order>) => {
    return await this.orderModel.findOne(query);
  };

  // findById = async (id: string): Promise<Order> => {
  //   // return await this.orderModel.findById(new Types.ObjectId(id));
  //   return await this.orderModel
  //     .aggregate([...$storeLookup, { $match: { _id: new Types.ObjectId(id) } }])
  //     .then((rs) => (rs ? rs[0] : null));
  // };

  page = async (page: PageParams): Promise<PageResult<Order>> => {
    let query = {
      $match: {},
    } as any;

    if (page.keyword) {
      query.$match.$and = query.$match.$and || [];
      query.$match.$and.push({
        $or: [
          {
            ref: new RegExp(`^${page.keyword}`, 'i'),
          },
          {
            contactName: { $regex: `.*${page.keyword}.*`, $options: 'i' },
          },
          {
            contactPhone: { $regex: `.*${page.keyword}.*`, $options: 'i' },
          },
        ],
      });
    }

    if (page.userId) {
      query.$match.$and = query.$match.$and || [];
      query.$match.$and.unshift({
        userId: new Types.ObjectId(page.userId),
      });
    }

    if (page.startDate) {
      query.$match.$and = query.$match.$and || [];
      query.$match.$and.push({
        date: {
          $gte: new Date(Number(page.startDate)).getTime(),
          $lt: new Date(Number(page.endDate)).getTime(),
        },
      });
    }

    return await this.orderModel
      .aggregate([query, { $sort: { date: -1 } }, { ...handlePageFacet(page) }])
      .then(handlePageResult);
  };
}
