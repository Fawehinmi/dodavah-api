import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlAuthorize, GqlCurrentUser } from 'src/auth/decorators';
import { Role } from 'src/enum';

import { TransactionService } from './transaction.service';

@Resolver()
export class TransactionResolver {
  constructor(private readonly transacSvc: TransactionService) {}
}
