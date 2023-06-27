import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import {
  CheckoutInput,
  Order,
  OrderPageInput,
  OrderPageResult,
} from './order.dto';
import { OrderService } from './order.service';
import { GqlAuthorize, GqlCurrentUser } from 'src/auth/decorators';
import { Role } from 'src/enum';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(private readonly orderSvc: OrderService) {}

  @Query((type) => OrderPageResult, { name: 'userOrderPage' })
  @GqlAuthorize()
  async userOrderPage(
    @Args('page') page: OrderPageInput,
    @GqlCurrentUser() user: any,
  ) {
    console.log('rannnnnnnnnnnnnn');
    const pageRs = await this.orderSvc.page({
      ...page,
      userId: user._id,
    } as any);
    console.log(pageRs, 'PAGEEEE');

    return pageRs;
  }

  @Query((type) => OrderPageResult, { name: 'orderPage' })
  @GqlAuthorize([Role.SuperAdmin])
  async orderPage(
    @Args('page') page: OrderPageInput,
    @GqlCurrentUser() user: any,
  ) {
    console.log(user, 'User');
    const pageRs = await this.orderSvc.page({
      ...page,
    } as any);

    console.log(pageRs, 'Page Ress');

    return pageRs;
  }

  @Mutation((returns) => String, { name: 'checkout' })
  @GqlAuthorize([Role.Member])
  async checkout(
    @Args('contact') data: CheckoutInput,
    @GqlCurrentUser() user: any,
  ) {
    return await this.orderSvc.checkout(data as any, user?._id);
  }

  @Mutation((returns) => Boolean, { name: 'verifyTransaction' })
  @GqlAuthorize([Role.Member])
  async create(
    @Args('reference') reference: String,
    @GqlCurrentUser() user: any,
  ) {
    return await this.orderSvc.verify(reference);
  }

  // @Mutation((type) => Boolean, { name: 'updateOrderStatus' })
  // @GqlAuthorize()
  // async updateOrderStatus(
  //   @Args('orderId') orderId: string,
  //   @Args('status') status: string,
  //   @GqlCurrentUser() user: any,
  // ) {
  //   return await this.orderSvc.updateStatus(orderId, status, user.storeId);
  // }
}
