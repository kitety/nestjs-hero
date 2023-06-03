import { Module } from '@nestjs/common';
import SmsController from './sms.controller';
import SmsService from './sms.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [SmsController],
  providers: [SmsService],
  exports: [],
  imports: [UsersModule, ConfigModule],
})
export class SmsModule {}
