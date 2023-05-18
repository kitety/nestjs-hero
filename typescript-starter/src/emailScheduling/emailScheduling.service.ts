import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EmailScheduleDto } from './dto/emailSchedule.dto';
import { CronJob } from 'cron';
import EmailService from '../email/email.service';

@Injectable()
export default class EmailSchedulingService {
  constructor(
    private readonly emailService: EmailService,
    private readonly scheduleRegistry: SchedulerRegistry,
  ) {}

  // @Cron('* * * * * *')
  // @Interval(6000)
  log() {
    console.log('cron is running');
  }

  scheduleEmails(emailSchedule: EmailScheduleDto) {
    const date = new Date(emailSchedule.date);
    const job = new CronJob(date, () => {
      this.emailService.sendMail({
        to: emailSchedule.recipient,
        subject: emailSchedule.subject,
        text: emailSchedule.content,
      });
    });
    this.scheduleRegistry.addCronJob(
      `${Date.now()}-${emailSchedule.subject}`,
      job,
    );
    job.start();
  }

  cancelAllScheduledEmails() {
    this.scheduleRegistry.getCronJobs().forEach((job) => {
      job.stop();
    });
  }
}
