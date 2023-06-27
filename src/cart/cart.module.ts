import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';

import { ProductModule } from 'src/product/product.module';
import { CartRepository } from './cart.repository';
import { CartResolver } from './cart.resolver';
import { CartItem, CartItemSchema } from './cart.schema';
import { CartService } from './cart.service';
import { PaystackModule } from 'src/utils/paystack/paystack.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule,
    ProductModule,
    PaystackModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: CartItem.name, schema: CartItemSchema },
    ]),
  ],
  providers: [CartService, CartRepository, CartResolver],
  exports: [CartService],
})
export class CartModule {}
