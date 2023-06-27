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
import { UpdateUserInput, User } from './users.dto';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly userSvc: UsersService) {}

  @ResolveField((returns) => String)
  async fullName(@Parent() user: User): Promise<string> {
    return `${user?.firstName} ${user?.lastName}`;
  }

  @Query((returns) => User, { name: 'user' })
  async findOneById(
    @Args('id', { nullable: false })
    id: string,
  ) {
    return this.userSvc.findById(id);
  }

  @Query((returns) => User, { name: 'currentUser' })
  @GqlAuthorize()
  async currentUser(@GqlCurrentUser() user: any) {
    return this.userSvc.findById(user?._id);
  }

  @Mutation((returns) => User, { name: 'updateUser' })
  @GqlAuthorize()
  async update(
    @Args('account') args: UpdateUserInput,
    @GqlCurrentUser() user: any,
  ) {
    return await this.userSvc.update(user._id, args as any);
  }
}
