import { Injectable } from '@nestjs/common';

import * as _ from 'lodash';

import { OrderRepository } from './order.repository';
import Order, { CheckoutInput, PageParams, PageResult } from './order.schema';
import { ConfigService } from '@nestjs/config';
import { PaystackService } from 'src/utils/paystack/paystack.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { CartService } from 'src/cart/cart.service';
import { nextOrderCode } from './order.schema';
import { UsersService } from 'src/users/users.service';
const crypto = require('crypto');

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly configSvc: ConfigService,
    private readonly payStackSvc: PaystackService,
    private readonly transacSvc: TransactionService,
    private readonly cartSvc: CartService,
  ) {}

  create = async (model: Order): Promise<Order> => {
    model.ref = await nextOrderCode();
    return this.orderRepo.create(model);
  };
  public checkout = async (item: CheckoutInput, userId): Promise<String> => {
    const userCart = await this.cartSvc.findUserCart(userId);

    const params = {
      email: item?.email,
      amount: userCart?.totalPrice,
    };

    const rs = await this.payStackSvc.makePayment(params);

    if (rs?.status !== true)
      throw new Error('Error processing your order please try again');

    // Create a transaction record for paystack

    const paystackReference = rs?.data?.reference;

    const hash_key = this.configSvc.get<string>('crypto.secret');

    const hashedReference = crypto
      .createHmac('sha256', hash_key)
      .update(paystackReference)
      .digest('hex');

    await this.transacSvc.create({
      ...item,
      userId,
      reference: hashedReference,
    });

    return rs?.data.authorization_url;
  };
  verify = async (ref: String) => {
    const hash_key = this.configSvc.get<string>('crypto.secret');

    const hashedReference = crypto
      .createHmac('sha256', hash_key)
      .update(ref as any)
      .digest('hex');

    const transaction = await this.transacSvc.findOne({
      reference: hashedReference,
    });

    if (!transaction) return false;
    const rs = await this.payStackSvc.verifyPayment(ref);

    if (rs?.data?.status == 'success') {
      const userCart = await this.cartSvc.findUserCart(
        transaction.userId.toString(),
      );
      const orderWithRef = await this.findOne({
        hashedPaymentRef: hashedReference,
      });

      if (orderWithRef) return true;
      await this.create({
        ...userCart,
        hashedPaymentRef: hashedReference,
        contactName: transaction.contactName,
        contactPhone: transaction.contactPhone,
        address: transaction.address,
        userId: transaction.userId.toString(),
      });
      await this.cartSvc.clearCart(transaction.userId.toString());
      return true;
    } else {
      return false;
    }
  };

  // updateStatus = async (
  //   orderId: string,
  //   status: string,
  //   userId: string,
  // ): Promise<Boolean> => {

  //   return true;
  // };

  // findById = async (id: string): Promise<Order> => {
  //   return await this.orderRepo.findById(id);
  // };
  findOne = async (query: Partial<Order>): Promise<Order> => {
    return await this.orderRepo.findOne(query);
  };

  page = async (page: PageParams): Promise<PageResult<Order>> => {
    return this.orderRepo.page(page);
  };
}
