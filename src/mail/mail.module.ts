import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [MailService, MailProcessor, PrismaService],
})
export class MailModule {}
