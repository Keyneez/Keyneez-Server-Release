import { Users } from '@prisma/client';
import { Token } from '../service/token.service';
import { UserInfoResponseDto } from 'src/domain/user/dtos/user-info.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TokenResponseDto } from './token.response.dto';

export class OAuthLoginResponseDto {
  @ApiProperty({
    type: Boolean,
    description:
      'true이면 회원가입이 필요한 경우니 회원가입을, false면 token과 user 정보가 주어집니다.',
    example: 'true or false (boolean type)',
  })
  is_new_user: boolean;

  @ApiProperty({
    description: 'token 정보',
  })
  token: TokenResponseDto;

  @ApiProperty({
    description: '유저 정보',
  })
  user: UserInfoResponseDto;

  constructor(isNewUser: boolean, token?: Token, user?: Users) {
    this.is_new_user = isNewUser;
    this.token = token ? new TokenResponseDto(token) : null;
    this.user = user ? new UserInfoResponseDto(user) : null;
  }

  static newUser() {
    return new OAuthLoginResponseDto(true, null, null);
  }
}
