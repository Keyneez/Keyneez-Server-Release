import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OAuthLoginRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'oauth id token',
  })
  @IsString()
  id_token: string;
}
