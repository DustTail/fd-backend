import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models';
import { SessionsService } from '../sessions/sessions.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        SequelizeModule.forFeature([
            User
        ])
    ],
    controllers: [UsersController],
    providers: [UsersService, SessionsService]
})
export class UsersModule {}
