import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class UpdateSessionCookieInterceptor implements NestInterceptor {

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();

        const sessionToken = request?.cookies?.['token'];
        const sessionId = request?.user?.sessionId;

        return next
            .handle()
            .pipe(
                tap(() => {
                    if (sessionToken && sessionId && sessionToken !== sessionId) {
                        response.setCookie('token', sessionId);
                    }
                })
            );
    }

}
