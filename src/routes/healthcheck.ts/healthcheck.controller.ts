import { Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SesService } from 'src/services/ses/ses.service';

@ApiTags('healthcheck')
@Controller('healthcheck')
export class HealthcheckController {
    constructor(private readonly sesService: SesService) {}

    @Post()
    @ApiOperation({ summary: 'test api' })
    @ApiCreatedResponse({ type: () => Boolean })
    async test(): Promise<boolean> {
        return true;
    }
}
