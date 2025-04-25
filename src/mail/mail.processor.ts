import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);
  private transporter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
      secure: true,
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });
  }

  @Interval(10000) // cada 5s
  async handleJobs() {
    // 1. Tomar un job pending
    const job = await this.prisma.mailJob.findFirst({
      where: { status: 'pending', attempts: { lt: 3 } },
      orderBy: { createdAt: 'asc' },
    });
    if (!job) return;

    // 2. Marcar processing
    await this.prisma.mailJob.update({
      where: { id: job.id },
      data: { status: 'processing', attempts: job.attempts + 1 },
    });

    try {
      // 3. Enviar
      await this.transporter.sendMail({
        from: `"Mailer Service" <${this.config.get('MAIL_USER')}>`,
        to: job.to,
        subject: job.subject,
        html: `<div>${job.body}</div>`,
      });

      // 4. Marcar done
      await this.prisma.mailJob.update({
        where: { id: job.id },
        data: { status: 'done' },
      });
      this.logger.log(`Email sent to ${job.to}`);
    } catch (err) {
      // 5. En error: actualizar lastError, si llegó a maxAttempts marcar failed
      const isFailed = job.attempts + 1 >= job.maxAttempts;
      await this.prisma.mailJob.update({
        where: { id: job.id },
        data: {
          status: isFailed ? 'failed' : 'pending',
          lastError: err.message,
        },
      });
      this.logger.error(`Job ${job.id} error: ${err.message}`);
    }
  }
}
