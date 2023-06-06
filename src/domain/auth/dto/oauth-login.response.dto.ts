import { Token } from '../jwt/jwt.utils';

export class OAuthLoginResponseDto {
  isNewUser: boolean;
  token: Token;
  user?: any;

  constructor(isNewUser: boolean, token?: Token, user?: any) {
    this.isNewUser = isNewUser;
    this.token = token;
    this.user = user;
  }

  static newUser() {
    return new OAuthLoginResponseDto(true, null, null);
  }
}
