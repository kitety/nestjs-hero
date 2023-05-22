import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: CreateUserDto) {
    const address = user.address;
    return this.prismaService.user.create({
      data: {
        ...user,
        address: {
          create: address,
        },
      },
      include: {
        address: true,
      },
    });
  }
}
