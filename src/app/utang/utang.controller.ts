import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UtangService } from './utang.service';
import { createUtangDto } from './dto/create-utang.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('utang')
export class UtangController {
  constructor(private utangService: UtangService) {}

  @ApiOperation({
    summary: 'Access restriction: User',
    description: 'Gets the direct messages for display',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUtangDto: createUtangDto, @Req() jwtData: any) {
    return this.utangService.create(createUtangDto, jwtData);
  }

  @ApiOperation({
    summary: 'Access restriction: User',
    description: 'Gets the direct messages for display',
  })
  @Get()
  async getAll() {
    return this.utangService.getAll();
  }

  @ApiOperation({
    summary: 'Access restriction: User',
    description: 'Gets the direct messages for display',
  })
  @Get('user/utang-list')
  @UseGuards(JwtAuthGuard)
  async getUtangByUserId(@Req() jwtData: any) {
    return this.utangService.getUtangByUserId(jwtData);
  }

  @Delete(':uid')
  @UseGuards(JwtAuthGuard)
  async deleteUtangById(@Param('uid') uid: string, @Req() jwtData: any) {
    return this.utangService.deleteUtangByUid(uid, jwtData);
  }

  @Get(':uid')
  @UseGuards(JwtAuthGuard)
  async getUtangByUid(@Param('uid') uid: string) {
    return this.utangService.getUtangByUid(uid);
  }

  @Patch(':uid')
  @UseGuards(JwtAuthGuard)
  async updateUtang(
    @Param('uid') uid: string,
    @Req() jwtData,
    @Body() updateDto: createUtangDto,
  ) {
    return this.utangService.updateUtangByUid(uid, jwtData, updateDto);
  }
}
