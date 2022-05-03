import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PaginationDto {
    @Expose()
    @ApiProperty()
        totalCount: number;

    @Expose()
    @ApiProperty()
        nextOffset?: number;

    constructor(pagination: any) {
        this.totalCount = pagination.count;
        this.nextOffset = pagination.offset + pagination.limit;

        if (this.nextOffset >= this.totalCount) {
            this.nextOffset = undefined;
        }
    }
}
