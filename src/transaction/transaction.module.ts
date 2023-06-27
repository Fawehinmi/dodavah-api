import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { TransactionRepository } from './transaction.repository';
import { Transaction, TransactionSchema } from './transaction.schema';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { PaystackModule } from 'src/utils/paystack/paystack.module';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from 'src/order/order.module';
import { CartService } from 'src/cart/cart.service';
import { Module, forwardRef } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
@Module({
  imports: [
    AuthModule,
    PaystackModule,
    ConfigModule,
    OrderModule,
    CartModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [TransactionService, TransactionRepository, TransactionResolver],
  exports: [TransactionService],
})
export class TransactionModule {}
