import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';

import { OrderRepository } from './order.repository';
import { OrderResolver } from './order.resolver';
import Order, { OrderSchema } from './order.schema';
import { OrderService } from './order.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { PaystackModule } from 'src/utils/paystack/paystack.module';
import { CartModule } from 'src/cart/cart.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule,

    forwardRef(() => AuthModule),
    forwardRef(() => TransactionModule),
    forwardRef(() => PaystackModule),
    forwardRef(() => CartModule),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  providers: [OrderService, OrderRepository, OrderResolver],
  exports: [OrderService],
})
export class OrderModule {}
