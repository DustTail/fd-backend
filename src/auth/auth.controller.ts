import { Body, Controller, Delete, HttpCode, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionDto, UserSessionDto } from 'src/dtos';
import { CreateSessionByCredentialsSchema, CreateSessionByGoogleSchema, DestroySessionSchema, ProlongSessionSchema } from 'src/schemas/auth';
import { GoogleService } from 'src/services/google/google.service';
import { RedisService } from 'src/services/redis/redis.service';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly redisService: RedisService,
        private readonly googleService: GoogleService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create new session with email+password combination' })
    @ApiCreatedResponse({ type: () => UserSessionDto })
    async createSession(
        @Body() body: CreateSessionByCredentialsSchema
    ): Promise<UserSessionDto> {
        const user = await this.authService.findUserByEmail(body.email);
        this.authService.comparePasswords(user.password, user.salt, body.password);

        const permissionData = this.authService.collectPermissionsData(user);
        const tokens = this.authService.generateTokens(user.id);
        await this.redisService.saveSession(user.id, permissionData, tokens);

        return new UserSessionDto(user, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    }

    @Post('google')
    @ApiOperation({ summary: 'Create new user and session via Google' })
    @ApiCreatedResponse({ type: () => UserSessionDto })
    async createSessionWithGMail(
        @Body() body: CreateSessionByGoogleSchema
    ): Promise<UserSessionDto> {
        const userData = await this.googleService.verifyToken(body.token);
        const user = await this.authService.findOrCreateUser(userData);

        const permissionData = this.authService.collectPermissionsData(user);
        const tokens = this.authService.generateTokens(user.id);
        await this.redisService.saveSession(user.id, permissionData, tokens);

        return new UserSessionDto(user, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    }

    @Put()
    @ApiOperation({ summary: 'Prolong current session' })
    @ApiOkResponse({ type: () => SessionDto })
    async prolongSession(
        @Body() body: ProlongSessionSchema
    ): Promise<SessionDto> {
        this.authService.verifyToken(body.refreshToken);
        const userId = await this.redisService.getUserId(body.refreshToken);
        const user = await this.authService.getUserById(userId);
        const permissionData = this.authService.collectPermissionsData(user);
        const tokens = this.authService.generateTokens(user.id);
        await this.redisService.destroySessionToken(body.refreshToken);
        await this.redisService.saveSession(user.id, permissionData, tokens);

        return new SessionDto({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    }

    @Delete()
    @ApiOperation({ summary: 'Destroy current session' })
    @HttpCode(204)
    async destroySession(
        @Body() body: DestroySessionSchema
    ): Promise<void> {
        await this.redisService.getUserId(body.refreshToken);
        await this.redisService.destroySessionToken(body.refreshToken);
    }

}
