import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models';
import { SesService } from 'src/services/ses/ses.service';
import { TokensService } from '../verifications/tokens.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        SequelizeModule.forFeature([
            User
        ])
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        SesService,
        TokensService
    ]
})
export class UsersModule {}
