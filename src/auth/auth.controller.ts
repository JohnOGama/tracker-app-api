import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { createUserDto } from './dto/create-user.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @ApiOperation({
    summary: 'access restriction: public',
    description: 'User login.',
  })
  @ApiBody({ type: LoginDto })
  @Post()
  async login(@Body() data: LoginDto) {
    return this.AuthService.login(data);
  }

  @ApiOperation({
    summary: 'access restriction: public',
    description: 'User login.',
  })
  @ApiBody({ type: createUserDto })
  @Post('signup')
  async signup(@Body() data: createUserDto ) {
    return this.AuthService.create(data);
  }
}
