import { BadRequestException, Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';
import { Transaction } from 'sequelize';
import { SequelizeTransaction } from 'src/common/decorators';
import { TransactionInterceptor } from 'src/common/interceptors';
import { UserDto } from 'src/dtos';
import { CreateUserSchema } from 'src/schemas/users/createUser.schema';
import { SesService } from 'src/services/ses/ses.service';
import { TokensService } from '../verifications/tokens.service';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly i18n: I18nService,
        private readonly usersService: UsersService,
        private readonly sesService: SesService,
        private readonly tokensService: TokensService
    ) { }

    @Post()
    @UseInterceptors(TransactionInterceptor)
    async registration(
        @SequelizeTransaction() transaction: Transaction,
        @Body() body: CreateUserSchema,
    ): Promise<UserDto> {
        const existUser = await this.usersService.findUserByEmail(body.email, transaction);

        if (existUser) {
            throw new BadRequestException(this.i18n.t('users.USER_ALREADY_EXIST'));
        }

        const user = await this.usersService.createUser(body, transaction);
        const token = this.tokensService.createEmailVerificationToken(user.id);
        // await this.sesService.sendWelcomeEmail(user.email, token);

        return new UserDto(user);
    }
}
