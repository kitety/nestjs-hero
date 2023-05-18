import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { EmailSchedulingController } from './emailSchedule.controller';
import EmailSchedulingService from './emailScheduling.service';

@Module({
  imports: [EmailModule],
  controllers: [EmailSchedulingController],
  providers: [EmailSchedulingService],
})
export class EmailSchedulingModule {}
