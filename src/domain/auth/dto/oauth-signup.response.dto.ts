import { UserInfoResponseDto } from 'src/domain/user/dto/user-info.response.dto';
import { Token } from '../jwt/jwt.utils';
import { Users } from '@prisma/client';

export class OAuthSignUpResponseDto {
  token: Token;
  user: UserInfoResponseDto;
  constructor(token: Token, user: Users) {
    this.token = token;
    this.user = new UserInfoResponseDto(user);
  }
}
