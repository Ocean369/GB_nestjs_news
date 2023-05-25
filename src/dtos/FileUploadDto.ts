import { ApiProperty } from '@nestjs/swagger'

class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}

