import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import JwtAuthenticationGuard from '../jwt-authentication.guard';
import { Response } from 'express';
import RequestWithUserInterface from '../requestWithUser.interface';
import { TwoFactorAuthenticationCodeDto } from './dto/TwoFactorAuthenticationCodeDto.dto';
import { UsersService } from '../../users/users.service';
import { AuthenticationService } from '../authentication.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthenticationGuard)
  async register(
    @Res() response: Response,
    @Req() req: RequestWithUserInterface,
  ) {
    const { otpAuthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        req.user,
      );
    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpAuthUrl,
    );
  }

  @Post('turn-on')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthenticationGuard)
  async turnOnTwoFactorAuthentication(
    @Req() req: RequestWithUserInterface,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        req.user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuthentication(req.user.id);
  }

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthenticationGuard)
  async authenticate(
    @Req() req: RequestWithUserInterface,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        req.user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      req.user.id,
      true,
    );
    req.res.setHeader('Set-Cookie', accessTokenCookie);
    return req.user;
  }
}
