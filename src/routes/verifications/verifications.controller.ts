import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyEmailAddressSchema } from 'src/schemas/verifications';
import { UsersService } from '../users/users.service';
import { TokensService } from './tokens.service';

@ApiTags('verifications')
@Controller('verifications')
export class VerificationsController {
    constructor(
        private readonly configService: ConfigService,
        private readonly tokensService: TokensService,
        private readonly usersService: UsersService,
    ) { }

    @Get('email')
    @ApiOperation({ summary: 'Verify email address' })
    @ApiOkResponse({ type: () => Boolean })
    async verifyEmailAddress(
        @Query() query: VerifyEmailAddressSchema,
        @Res() res,
    ): Promise<void> {
        const userId = this.tokensService.getUserIdFromEmailVerificationToken(query.token);
        await this.usersService.verifyUserEmail(userId);

        const redirectUrl = this.configService.get('REDIRECT_URL_MAIN_PAGE');
        res
            .status(302)
            .redirect(redirectUrl);
    }
}
