import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: '앱에서 발급한 refresh token',
  })
  @IsString()
  refresh_token: string;
}
