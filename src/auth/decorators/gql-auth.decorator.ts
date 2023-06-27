import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { GqlAuthGuard, GqlRolesGuard } from "../guards";

export const GqlAuthorize = (roles?: string | string[]) =>
  applyDecorators(
    SetMetadata("roles", [roles].flat()),
    UseGuards(GqlRolesGuard)
  );
