import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import * as moment from 'moment';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(new Types.ObjectId(id));
  }

  async findOne(query: Partial<User>): Promise<User> {
    if (query._id) query._id = new Types.ObjectId(query._id);

    if (query.name) {
      query['$and'] = [
        {
          $or: [
            { firstName: new RegExp(`^${query.name}`, 'i') },
            { lastName: new RegExp(`^${query.name}`, 'i') },
            { otherName: new RegExp(`^${query.name}`, 'i') },
          ],
        },
      ];
    }

    return this.userModel.findOne(query);
  }

  async update(id: string, model: Partial<User>): Promise<void> {
    await this.userModel.updateOne(
      { _id: id },
      { ...model, updatedAt: Date.now() },
    );
  }

  async generateUserId(): Promise<string> {
    const currentDate = new Date();

    const code = `${currentDate.getDate()}${
      currentDate.getMonth() + 1
    }${currentDate.getFullYear()}${new Date().getTime().toString().slice(-3)}`;

    const exist = await this.userModel
      .aggregate([
        {
          $addFields: {
            creationDate: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
          },
        },
        {
          $match: {
            $and: [
              { creationDate: { $eq: moment().format('YYYY-MM-DD') } },
              { code: code },
            ],
          },
        },
      ])
      .limit(1)
      .then((rs) => {
        if (rs && rs.length == 0) return null;
        return rs[0];
      });

    if (exist) return this.generateUserId();

    return code;
  }
}
