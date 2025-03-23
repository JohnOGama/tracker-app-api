import { ApiProperty } from '@nestjs/swagger';

export class updateDto {
  @ApiProperty()
  full_name: string;
}
