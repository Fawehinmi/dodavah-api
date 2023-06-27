import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { helper } from 'src/helper';
// import { helper } from 'src/core';
import { Transaction, TransactionDocument } from './transaction.schema';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(Transaction.name)
    private TransactionModel: SoftDeleteModel<TransactionDocument>,
  ) {}

  async create(model: Transaction): Promise<Transaction> {
    if (model.userId) model.userId = new Types.ObjectId(model.userId);
    const createdTransaction = new this.TransactionModel({
      ...model,
    });
    return createdTransaction.save();
  }

  findOne = async (query: Partial<Transaction>) => {
    if (query._id) query._id = new Types.ObjectId(query._id);

    return await this.TransactionModel.findOne(query);
  };
}
