import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Types } from 'mongoose';
import { GqlAuthorize, GqlCurrentUser } from 'src/auth/decorators';
import { Role } from 'src/enum';

import { AddItemInput, Cart, CartItemInput } from './cart.dto';
import { CartService } from './cart.service';

@Resolver((of) => Cart)
export class CartResolver {
  constructor(private readonly cartSvc: CartService) {}

  @Mutation((returns) => Cart, { name: 'addCartItem' })
  @GqlAuthorize([Role.Member])
  async create(@Args('item') item: AddItemInput, @GqlCurrentUser() user: any) {
    return await this.cartSvc.addItem({
      ...item,
      userId: user._id,
    } as any);
  }

  @Mutation((returns) => Cart, { name: 'updateCartItem' })
  @GqlAuthorize([Role.Member])
  async update(
    @Args('_id') _id: string,
    @Args('item') item: CartItemInput,
    @GqlCurrentUser() user: any,
  ) {
    return await this.cartSvc.updateItem(_id, user?._id, {
      ...item,
    } as any);
  }

  @Mutation((returns) => Cart, { name: 'deleteCartItem' })
  @GqlAuthorize([Role.Member])
  async delete(@Args('_id') _id: string, @GqlCurrentUser() user: any) {
    return await this.cartSvc.deleteItem(_id);
  }

  @Query((returns) => Cart, { name: 'findUserCart', nullable: true })
  @GqlAuthorize([Role.Member])
  async findUserCart(@GqlCurrentUser() user: any) {
    return await this.cartSvc.findUserCart(user._id);
  }
}
