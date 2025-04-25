import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import { MailService } from './mail.service';

@Controller('send-mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @HttpCode(202)
  async enqueue(@Body() dto: SendMailDto) {
    await this.mailService.enqueueJob(dto);
    return { status: 'queued' };
  }
}
