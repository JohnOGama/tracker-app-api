import { Module } from '@nestjs/common';
import { UtangService } from './utang.service';
import { UtangController } from './utang.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users.entity';
import { Utang } from 'src/database/entities/utang.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User, Utang])],
  providers: [UtangService],
  controllers: [UtangController],
})
export class UtangModule {}
