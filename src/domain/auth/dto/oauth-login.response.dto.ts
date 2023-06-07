import { Users } from '@prisma/client';
import { Token } from '../service/token.service';
import { UserInfoResponseDto } from 'src/domain/user/dto/user-info.response.dto';

export class OAuthLoginResponseDto {
  is_new_user: boolean;
  token?: Token;
  user?: UserInfoResponseDto;

  constructor(isNewUser: boolean, token?: Token, user?: Users) {
    this.is_new_user = isNewUser;
    this.token = token;
    this.user = user ? new UserInfoResponseDto(user) : null;
  }

  static newUser() {
    return new OAuthLoginResponseDto(true, null, null);
  }
}
