import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import EmailSchedulingService from './emailScheduling.service';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { EmailScheduleDto } from './dto/emailSchedule.dto';

@Controller('email-scheduling')
export class EmailSchedulingController {
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async scheduleEmails(@Body() smailSchedule: EmailScheduleDto) {
    return this.emailSchedulingService.scheduleEmails(smailSchedule);
  }
}
