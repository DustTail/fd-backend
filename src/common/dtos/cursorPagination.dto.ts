import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CursorPaginationDto {
    @Expose()
    @ApiProperty()
        previousCursor: number;

    @Expose()
    @ApiProperty()
        nextCursor?: number;

    constructor(pagination: any) {
        this.previousCursor = pagination?.previousCursor?.id;
        this.nextCursor = pagination?.nextCursor?.id;
    }
}
