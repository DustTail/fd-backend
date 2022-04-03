import { Module } from '@nestjs/common';
import { GoogleService } from 'src/services/google/google.service';

@Module({
    providers: [GoogleService],
    exports: [GoogleService]
})
export class GoogleModule {}
