import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AUTH_KEY } from './auth.constant';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredAuthParams = this.reflector.getAllAndOverride<any>(AUTH_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredAuthParams) {
            return true;
        }

        const { role, roles } = requiredAuthParams;

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new UnauthorizedException();
        }

        if (role && role !== user.role || roles && !roles.includes(user.role)) {
            return false;
        }

        return true;
    }
}
