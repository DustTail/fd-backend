import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models';
import { GoogleService } from 'src/services/google/google.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BearerStrategy } from './bearer.strategy';

@Module({
    imports: [
        SequelizeModule.forFeature([
            User
        ])
    ],
    controllers: [AuthController],
    providers: [AuthService, BearerStrategy, GoogleService],
    exports: [BearerStrategy]
})
export class AuthModule {}
