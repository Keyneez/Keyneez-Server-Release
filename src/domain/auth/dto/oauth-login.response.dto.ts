import { Users } from '@prisma/client';
import { Token } from '../service/token.service';
import { UserInfoResponseDto } from 'src/domain/user/dto/user-info.response.dto';

export class OAuthLoginResponseDto {
  isNewUser: boolean;
  token: Token;
  user?: UserInfoResponseDto;

  constructor(isNewUser: boolean, token?: Token, user?: Users) {
    this.isNewUser = isNewUser;
    this.token = token;
    this.user = new UserInfoResponseDto(user);
  }

  static newUser() {
    return new OAuthLoginResponseDto(true, null, null);
  }
}
