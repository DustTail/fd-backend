import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models';
import { GoogleService } from 'src/services/google/google.service';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
    imports: [
        SequelizeModule.forFeature([
            User
        ])
    ],
    controllers: [SessionsController],
    providers: [GoogleService, SessionsService],
    exports: [SessionsService]
})
export class SessionsModule {}
