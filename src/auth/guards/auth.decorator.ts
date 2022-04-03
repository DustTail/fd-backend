import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { AppGuard } from './app.guard';
import { AUTH_KEY } from './auth.constant';
import { AuthGuard } from './auth.guard';

export interface AuthParams {
    role?: number,
    roles?: number[],
}

export function Auth(authParams: AuthParams) {
    return applyDecorators(
        SetMetadata(AUTH_KEY, authParams),
        UseGuards(AppGuard, AuthGuard),
        ApiCookieAuth()
    );
}
