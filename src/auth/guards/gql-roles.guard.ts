import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from 'src/enum';
import { AuthService } from '../auth.service';
import { ROLES_KEY } from '../decorators';
import { GqlAuthGuard } from './gql-auth.guard';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authGuard: GqlAuthGuard,
    private authSvc: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await this.authGuard.canActivate(context);

    const requiredRoles = this.reflector
      .getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
      .filter((r) => r !== undefined);

    if (!requiredRoles || requiredRoles?.length == 0) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);

    const { req } = ctx.getContext();

    const user = await this.authSvc.user(req.user._id);

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
