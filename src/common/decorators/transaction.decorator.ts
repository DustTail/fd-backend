import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Transaction } from 'sequelize';

export const SequelizeTransaction = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Transaction => ctx.switchToHttp().getRequest().transaction
);
