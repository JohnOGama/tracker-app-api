import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { updateDto } from './dto/user-update.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get All Users',
    description: 'Return all users',
  })
  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @ApiOperation({
    summary: 'Update user',
    description: 'Update user',
  })
  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateUser(@Req() jwtData: any, @Body() updateDto: updateDto) {
    return this.usersService.updateProfile(jwtData, updateDto);
  }

  @ApiOperation({
    summary: 'View user profile',
    description: 'View user profile',
  })
  @Get('view/:uid')
  async viewUserProfile(@Param('uid') uid: string) {
    return this.usersService.viewProfile(uid);
  }
}
