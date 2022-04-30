import { Module } from '@nestjs/common';
import { GoogleService } from 'src/services/google/google.service';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
    controllers: [SessionsController],
    providers: [GoogleService, SessionsService],
    exports: [SessionsService]
})
export class SessionsModule {}
