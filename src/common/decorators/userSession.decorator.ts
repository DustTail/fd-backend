import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserSession = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Session => ctx.switchToHttp().getRequest().user
);
