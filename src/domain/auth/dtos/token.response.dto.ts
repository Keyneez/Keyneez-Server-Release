import { ApiProperty } from '@nestjs/swagger';
import { Token } from '../service/token.service';

export class TokenResponseDto {
  @ApiProperty({
    type: String,
    description: 'access 토큰 입니다.',
  })
  access_token: string;

  @ApiProperty({
    type: String,
    description: 'refresh 토큰 입니다.',
  })
  refresh_token: string;

  constructor(token: Token) {
    this.access_token = token.accessToken;
    this.refresh_token = token.refreshToken;
  }
}
