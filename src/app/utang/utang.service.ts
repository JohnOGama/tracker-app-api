import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Utang } from 'src/database/entities/utang.entity';
import { EntityManager, Repository } from 'typeorm';
import { createUtangDto } from './dto/create-utang.dto';
import { User } from 'src/database/entities/users.entity';
import { consoleLogger } from 'src/common/ConsoleError/console-error';

@Injectable()
export class UtangService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createUtangDto: createUtangDto, jwtData) {
    try {
      const { user_id } = jwtData?.user;

      return await this.entityManager.transaction(async (manager) => {
        const user = await manager.findOne(User, {
          where: { uid: user_id },
          relations: ['utang'],
        });

        if (!user) {
          throw new Error('User not found');
        }

        const response = manager.create(Utang, {
          title: createUtangDto.title,
          description: createUtangDto.description,
          price: createUtangDto.price,
          borrower_name: createUtangDto.borrower_name,
          user: user,
        });

        await manager.save(Utang, response);

        return createUtangDto;
      });
    } catch (error) {
      consoleLogger({
        fileLocation: 'utang.service.ts',
        functionName: 'create',
      });

      throw error;
    }
  }

  async getAll() {
    const data = this.entityManager.find(Utang);
    // const data = this.utangRepository.find();
    return data;
  }

  async getUtangByUserId(jwtData: any) {
    try {
      const { user_id } = jwtData?.user;

      const user = await this.entityManager.findOne(User, {
        where: { uid: user_id },
        relations: ['utang'],
      });

      if (!user) {
        throw new Error('User not found');
      }

      const utangAggregates = await this.entityManager
        .createQueryBuilder(Utang, 'utang')
        .leftJoinAndSelect('utang.user', 'user')
        .select(['utang.*', 'user.full_name AS creditor'])
        .where('utang.user = :userId', { userId: user.id })
        .getRawMany();

      return utangAggregates;
    } catch (error) {
      throw error;
    }
  }

  async getUtangByUid(uid: string) {
    try {
      const item = await this.entityManager.findOne(Utang, { where: { uid } });
      return item;
    } catch (error) {}
  }

  async deleteUtangByUid(uid: string, jwtData) {
    try {
      const { user_id } = jwtData?.user;
      const utang = await this.entityManager.findOne(Utang, {
        where: { uid },
        relations: ['user'],
      });

      if (!utang) {
        throw new BadRequestException('Utang not found');
      }

      // Ensure that only the owner can delete their Utang
      if (utang.user.uid !== user_id) {
        throw new ForbiddenException(
          'You are not allowed to delete this Utang',
        );
      }

      return await this.entityManager.remove(utang);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
    }
  }

  async updateUtangByUid(uid: string, jwtData: any, updateDto: createUtangDto) {
    try {
      const { user_id } = jwtData?.user;
      const utang = await this.entityManager.findOne(Utang, {
        where: { uid },
        relations: ['user'],
      });

      if (!utang) {
        throw new BadRequestException('Utang not found');
      }

      if (utang.user.uid !== user_id) {
        throw new ForbiddenException(
          'You are not allowed to delete this Utang',
        );
      }

      await this.entityManager.update(Utang, { uid }, updateDto);

      return await this.entityManager.findOne(Utang, { where: { uid } });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
    }
  }
}
