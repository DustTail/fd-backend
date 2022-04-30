import { Module } from '@nestjs/common';
import { SessionsModule } from 'src/routes/sessions/sessions.module';
import { BearerStrategy } from './bearer.strategy';

@Module({
    imports: [SessionsModule],
    providers: [BearerStrategy],
    exports: [BearerStrategy]
})
export class AuthModule {}
