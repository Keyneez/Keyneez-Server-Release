import { UserInfoResponseDto } from 'src/domain/user/dto/user-info.response.dto';
import { Token } from '../service/token.service';
import { Users } from '@prisma/client';
import { TokenResponseDto } from './token.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OAuthSignUpResponseDto {
  @ApiProperty({
    nullable: false,
    description: '회원가입도 토큰 리턴 합니다.',
  })
  token: TokenResponseDto;

  @ApiProperty({
    nullable: false,
    description: '유저 정보',
  })
  user: UserInfoResponseDto;
  constructor(token: Token, user: Users) {
    this.token = new TokenResponseDto(token);
    this.user = new UserInfoResponseDto(user);
  }
}
