import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SnsService } from './sns.service';
import { TokenService } from './token.service';
import { UserRepository } from 'src/domain/user/repository/user.repository';
import { OAuthLoginResponseDto } from '../dtos/oauth-login.response.dto';
import { OAuthSignUpRequestDto } from '../dtos/oauth-signup.request.dto';
import { OAuthSignUpResponseDto } from '../dtos/oauth-signup.response.dto';

@Injectable()
export class OAuthService {
  constructor(
    private snsService: SnsService,
    private tokenService: TokenService,
    private userRepository: UserRepository,
  ) {}

  async oauthKakaoLogin(idToken: string): Promise<OAuthLoginResponseDto> {
    const oauthUser = await this.snsService.kakaoIdTokenVerify(idToken);

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
    const {
      id_token: idToken,
      access_token: accessToken,
      nickname,
      age,
      birth,
      gender,
      tag_pks: tagPks,
    } = dto;
    const oauthUser = await this.snsService.kakaoIdTokenVerify(idToken);
    const findUser = await this.userRepository.findByOAuthUserType(oauthUser);
    if (findUser) {
      throw new ConflictException('이미 가입된 유저입니다.');
    }

    const userInfo = await this.snsService.getKakaoUserInfo(accessToken);

    const email = userInfo.email;
    try {
      const user = await this.userRepository.create(
        oauthUser,
        nickname,
        email,
        age,
        gender,
        birth,
        tagPks,
      );

      const token = await this.tokenService.generateToken(user);
      await this.userRepository.updateRefreshToken(
        user.user_pk,
        token.refreshToken,
      );
      return new OAuthSignUpResponseDto(token, user);
    } catch (e) {
      if (e.code === 'P2003') {
        throw new NotFoundException('해당 태그를 찾을 수 없습니다');
      }
      throw new InternalServerErrorException('서버 error');
    }
  }
}
