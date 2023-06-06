import { BadRequestException, Injectable } from '@nestjs/common';
import { SnsProvider } from './sns.provider';
import { JwtUtils } from '../jwt/jwt.utils';
import { UserRepository } from 'src/domain/user/repository/user.repository';
import { OAuthLoginResponseDto } from '../dto/oauth-login.response.dto';

@Injectable()
export class OAuthService {
  constructor(
    private snsProvider: SnsProvider,
    private jwtUtils: JwtUtils,
    private userRepository: UserRepository,
  ) {}

  async oauthLogin(idToken: string): Promise<OAuthLoginResponseDto> {
    const oauthUser = await this.snsProvider.kakaoIdTokenVerify(idToken);

    const findUser = await this.userRepository.findByOAuthUserType(oauthUser);
    if (findUser) {
      const token = await this.jwtUtils.generateToken(findUser);
      await this.userRepository.updateRefreshToken(
        findUser.user_pk,
        token.refreshToken,
      );
      return new OAuthLoginResponseDto(false, token, findUser);
    }
    return OAuthLoginResponseDto.newUser();
  }
}
