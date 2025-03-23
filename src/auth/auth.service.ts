import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/app/users/users.service';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/users.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { nonArrayToInstance } from 'src/common/helper/transformToInstance';
import { consoleLogger } from 'src/common/ConsoleError/console-error';
import * as bcrypt from 'bcrypt';
import { createUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './strategies/jwt.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email, role: UserRole.User },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isPasswordMatch = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid email and password');
      }
      const payload = nonArrayToInstance(User, user);

      const token = await this.generateToken(
        JSON.parse(JSON.stringify(payload)),
      );

      return {
        ...payload,
        access_token: token,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      consoleLogger({
        fileLocation: 'auth.service.ts',
        functionName: 'login',
      });
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async create(createDto: createUserDto) {
    try {
      // Check if user with same email exists
      const isUserExist = await this.userRepository.findOne({
        where: { email: createDto.email },
      });

      if (isUserExist) {
        throw new ConflictException('Email already exists');
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(createDto.password, 10);

      const user = this.userRepository.create({
        email: createDto.email,
        full_name: createDto.full_name,
        password: hashedPassword,
        role: createDto.role,
      });

      const token = await this.generateToken(JSON.parse(JSON.stringify(user)));

      const response = this.userRepository.save({
        ...user,
        access_token: token,
      });

      const payload = nonArrayToInstance(User, response);

      return payload;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      consoleLogger({
        fileLocation: 'auth.service.ts',
        functionName: 'create',
      });
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async generateToken(payload: User) {
    try {
      const token = await this.jwtService.sign(payload, {
        expiresIn: jwtConstants.accessTokenExpiration,
      });
      return token;
    } catch (error) {
      throw error;
    }
  }
}
