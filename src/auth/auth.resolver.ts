import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth, ChangePasswordInput, PhoneSignUpInput } from './auth.dto';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { GqlAuthorize, GqlCurrentUser } from './decorators';

@Resolver((of) => Auth)
export class AuthResolver {
  constructor(private readonly authSvc: AuthService) {}

  // @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Auth, { name: 'signIn' })
  async signIn(
    @Args('email')
    email: string,
    @Args('password')
    password: string,
    @Args('client')
    client: string,
  ) {
    const auth = await this.authSvc.login({ email, password, client });
    return auth;
  }

  @Mutation((returns) => Boolean, { name: 'phoneSignUp' })
  async phoneSinginUp(
    @Args('user')
    user: PhoneSignUpInput,
  ) {
    await this.authSvc.phoneSignup({
      ...user,
    } as any);
    return true;
  }

  @Mutation((returns) => String, { name: 'changePassword' })
  @GqlAuthorize()
  async changePassword(
    @Args('password') password: ChangePasswordInput,
    @GqlCurrentUser() user: any,
  ) {
    return this.authSvc.changePassword(
      {
        ...password,
      },
      user?._id as any,
    );
  }
}
