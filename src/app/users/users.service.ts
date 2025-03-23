import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users.entity';
import { EntityManager, Repository } from 'typeorm';
import { consoleLogger } from 'src/common/ConsoleError/console-error';
import { arrayToInstance } from 'src/common/helper/transformToInstance';
import { Utang } from 'src/database/entities/utang.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async getUsers() {
    try {
      const users = await this.usersRepository.find({ relations: ['utang'] });
      return arrayToInstance(User, users);
    } catch (error) {
      consoleLogger({
        fileLocation: 'user.service.ts',
        functionName: 'getUsers',
      });
      throw error;
    }
  }

  async updateProfile(jwtData, updateDto) {
    try {
      const { user_id } = jwtData?.user;

      const user = await this.entityManager.findOne(User, {
        where: { uid: user_id },
        relations: ['utang'],
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      await this.entityManager.update(User, { uid: user_id }, updateDto);

      return await this.entityManager.findOne(User, {
        where: { uid: user_id },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async viewProfile(uid: string) {
    try {
      const user = await this.entityManager
        .createQueryBuilder(User, 'user')
        .leftJoinAndSelect('user.utang', 'utang')
        .select([
          'user.uid',
          'user.full_name',
          'user.email',
          'user.created_at',
          'utang.title',
          'utang.description',
          'utang.borrower_name',
          'utang.price',
        ])
        .where('user.uid = :uid', { uid })
        .getOne();

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const total_price = user.utang.reduce(
        (total, utang) => total + utang.price,
        0,
      );

      const uniqueBorrowers = new Set(
        user.utang.map((utang) => utang.borrower_name),
      ).size;

      return {
        ...user,
        total_utang_price: total_price,
        borrower_count: uniqueBorrowers,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }
}
