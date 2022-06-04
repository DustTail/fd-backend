import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { first, isEmpty } from 'lodash';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { userRoles } from 'src/resources/users';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly requestLogger = new Logger('Request');
    private readonly responseLogger = new Logger('Response');
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const INTERNAL_SERVER_ERROR_CODE = 500;
        const httpContext = context.switchToHttp();
        const req = httpContext.getRequest();

        const method = first(Object.keys(req?.route?.methods)).toUpperCase();
        const path = req?.route?.path;

        const route = `${method} ${path}`;

        this.requestLogger.log(this.formatRequest(req, route));

        return next
            .handle()
            .pipe(
                map(data => {
                    this.responseLogger.log(this.formatResponse(data, route, now));
                    return data;
                }),
                catchError(error => {
                    if (error.status === INTERNAL_SERVER_ERROR_CODE) {
                        this.responseLogger.error(this.formatResponse(error, route, now));
                    } else if (error.status >= INTERNAL_SERVER_ERROR_CODE) {
                        this.responseLogger.warn(this.formatResponse(error, route, now));
                    } else {
                        this.responseLogger.log(this.formatResponse(error, route, now));
                    }

                    return throwError(() => error);
                })
            );
    }

    formatRequest(req, route) {
        const options = {
            params: req?.params,
            query: req?.query,
            // TODO: reduced request size due character limitations.
            // body: req?.body,
            user: req?.user && {
                userId: req.user.userId,
                role: userRoles[req.user.role]
            }
        };

        const requestData = Object.keys(options).reduce((accumulator, key) => {
            if (!isEmpty(options[key])) {
                accumulator[key] = options[key];
            }
            return accumulator;
        }, {});

        const message = `${route} >>> ${JSON.stringify(requestData)}`;

        return message;
    }

    formatResponse(res, route, requestTime) {
        const responseTime = Date.now() - requestTime;
        let message = `${route} (${responseTime}ms) <<< {}`;

        if (res) {
            // TODO: reduced response size due character limitations.
            // message = `${route} (${responseTime}ms) <<< ${JSON.stringify(res)}`;
            message = `${route} (${responseTime}ms) <<< OK`;
        }

        return message;
    }
}
