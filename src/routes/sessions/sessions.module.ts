import { Module } from '@nestjs/common';
import { GoogleService } from 'src/services/google.service';
import { SessionsController } from './sessions.controller';

@Module({
    controllers: [SessionsController],
    providers: [GoogleService]
})
export class SessionsModule {}
