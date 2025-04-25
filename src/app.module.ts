import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

const throttlerOptions: ThrottlerModuleOptions = [
  {
    ttl: 60,
    limit: 5,
  },
];

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot(throttlerOptions), // limits login & panel
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
