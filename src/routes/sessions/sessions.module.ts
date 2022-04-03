import { Module } from '@nestjs/common';
import { GoogleModule } from 'src/services/google/google.module';
import { SessionsController } from './sessions.controller';

@Module({
    imports: [GoogleModule],
    controllers: [SessionsController],
})
export class SessionsModule {}
