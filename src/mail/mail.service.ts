/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private prisma: PrismaService) {}

  async enqueueJob(dto: SendMailDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await this.prisma.mailJob.create({
      data: {
        to: dto.to,
        subject: dto.subject,
        body: dto.body,
      },
    });
    this.logger.log(`Job created for ${dto.to}`);
  }
}
