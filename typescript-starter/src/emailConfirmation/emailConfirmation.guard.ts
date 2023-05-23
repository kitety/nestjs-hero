import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.user?.isEmailConfirmed) {
      throw new HttpException(
        'Please confirm your email address',
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }
}
