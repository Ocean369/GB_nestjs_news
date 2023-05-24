import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('mail, sending test letter')
@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Get()
    @ApiOperation({ summary: 'Отправка тестового сообщения' })
    async sendTestEmail() {
        return await this.mailService.sendTest();
    }
}
