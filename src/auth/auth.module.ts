import { Module } from '@nestjs/common';
import { SessionsModule } from 'src/routes/sessions/sessions.module';
import { CookieStrategy } from './cookie.strategy';

@Module({
    imports: [SessionsModule],
    providers: [CookieStrategy],
    exports: [CookieStrategy]
})
export class AuthModule {}
