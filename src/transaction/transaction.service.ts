import { Injectable, Logger } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.schema';
import { PaystackService } from 'src/utils/paystack/paystack.service';
import { ConfigService } from '@nestjs/config';
import { OrderService } from 'src/order/order.service';
import { CartService } from 'src/cart/cart.service';
const crypto = require('crypto');

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(private readonly TransactionRepo: TransactionRepository) {}

  create = async (model: Transaction) => {
    return this.TransactionRepo.create(model);
  };

  findOne = async (query: Partial<Transaction>): Promise<Transaction> => {
    return await this.TransactionRepo.findOne(query);
  };
}
