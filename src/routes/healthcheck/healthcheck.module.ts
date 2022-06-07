import { Module } from '@nestjs/common';
import { SesService } from 'src/services/ses/ses.service';
import { HealthcheckController } from './healthcheck.controller';

@Module({
    imports: [],
    controllers: [HealthcheckController],
    providers: [SesService]
})
export class HealthcheckModule {}
