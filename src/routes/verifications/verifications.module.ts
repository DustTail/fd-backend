import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models';
import { UsersService } from '../users/users.service';
import { TokensService } from './tokens.service';
import { VerificationsController } from './verifications.controller';

@Module({
    imports: [
        SequelizeModule.forFeature([
            User
        ])
    ],
    controllers: [VerificationsController],
    providers: [
        TokensService,
        UsersService
    ]
})
export class VerificationsModule {}
