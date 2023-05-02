import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  // async deleteAvatar(userId: number) {
  // const queryRunner = this.dataSource.createQueryRunner();
  // const user = await this.getById(userId);
  // const fileId = user.avatar?.id;
  // if (fileId) {
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //
  //   try {
  //     await queryRunner.manager.update(User, userId, {
  //       ...user,
  //       avatar: null,
  //     });
  //     await this.filesService.deletePublicFile(fileId);
  //     await queryRunner.commitTransaction();
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw new InternalServerErrorException();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
  // }

  async getById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException(
      `User with id ${id} not found`,
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
