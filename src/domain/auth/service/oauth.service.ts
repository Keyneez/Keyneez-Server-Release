import { ConflictException, Injectable } from '@nestjs/common';
import { SnsProvider } from './sns.provider';
import { TokenService } from './token.service';
import { UserRepository } from 'src/domain/user/repository/user.repository';
import { OAuthLoginResponseDto } from '../dto/oauth-login.response.dto';
import { OAuthSignUpRequestDto } from '../dto/oauth-signup.request.dto';
import { OAuthSignUpResponseDto } from '../dto/oauth-signup.response.dto';

@Injectable()
export class OAuthService {
  constructor(
    private snsProvider: SnsProvider,
    private tokenService: TokenService,
    private userRepository: UserRepository,
  ) {}

  async oauthKakaoLogin(idToken: string): Promise<OAuthLoginResponseDto> {
    const oauthUser = await this.snsProvider.kakaoIdTokenVerify(idToken);

    const findUser = await this.userRepository.findByOAuthUserType(oauthUser);
    if (findUser) {
      const token = await this.tokenService.generateToken(findUser);
      await this.userRepository.updateRefreshToken(
        findUser.user_pk,
        token.refreshToken,
      );
      return new OAuthLoginResponseDto(false, token, findUser);
    }
    return OAuthLoginResponseDto.newUser();
  }

  async kakaoOauthSignup(dto: OAuthSignUpRequestDto) {
    const { idToken, accessToken, nickname, age, birth, gender } = dto;
    const oauthUser = await this.snsProvider.kakaoIdTokenVerify(idToken);
    const findUser = await this.userRepository.findByOAuthUserType(oauthUser);
    if (findUser) {
      throw new ConflictException('이미 가입된 유저입니다.');
    }

    const userInfo = await this.snsProvider.getKakaoUserInfo(accessToken);
    const name = '이름';
    const email = userInfo.email;
    const user = await this.userRepository.create(
      oauthUser,
      nickname,
      name,
      email,
      age,
      gender,
      birth,
    );

    const token = await this.tokenService.generateToken(user);
    await this.userRepository.updateRefreshToken(
      user.user_pk,
      token.refreshToken,
    );
    return new OAuthSignUpResponseDto(token, user);
  }
}
