import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OidcPublicKeyDto } from '../dto/oidc.public-key.dto';
import { TokenService } from './token.service';
import { OAuthUserTypeDto } from '../dto/oauth-user-type.dto';
import oauthConfig from 'src/global/configs/oauth.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class SnsService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private tokenService: TokenService,
    @Inject(oauthConfig.KEY) private config: ConfigType<typeof oauthConfig>,
  ) {}
  private KAKAO_PUBLIC_KEY_URL =
    'https://kauth.kakao.com/.well-known/jwks.json';

  async kakaoIdTokenVerify(token: string): Promise<OAuthUserTypeDto> {
    const KAKAO_ISSURE = 'https://kauth.kakao.com';
    const KAKAO_AUD = this.config.kakaoClientId;
    const kid = this.tokenService.getKidFromIdToken(token);
    const PUBLICK_KEY = await this.getKakaoPublicKey(kid);

    const payload = await this.tokenService.idTokenVerify(
      token,
      KAKAO_AUD,
      KAKAO_ISSURE,
      PUBLICK_KEY,
    );
    return new OAuthUserTypeDto('KAKAO', payload.sub);
  }

  private async getKakaoPublicKey(kid: string): Promise<OidcPublicKeyDto> {
    const kakaoPublicKeys = await this.getKakaoPublicKeysFromCache();
    const publicKeyByKid = kakaoPublicKeys.filter((key) => key.kid == kid);
    if (publicKeyByKid.length == 0) {
      throw new BadRequestException('잘못된 token');
    }
    return publicKeyByKid[0];
  }

  private async getKakaoPublicKeysFromCache(): Promise<OidcPublicKeyDto[]> {
    const KAKAO_PUBLIC_KEY_CAHCE = 'KAKAO_PUBLIC_KEY';
    let cachedKeys = await this.cacheManager.get<OidcPublicKeyDto[]>(
      KAKAO_PUBLIC_KEY_CAHCE,
    );

    if (!cachedKeys) {
      const newKeys = (
        await this.httpService.axiosRef.get(this.KAKAO_PUBLIC_KEY_URL)
      ).data;
      await this.cacheManager.set(
        KAKAO_PUBLIC_KEY_CAHCE,
        newKeys.keys,
        60 * 60 * 24,
      );
    }
    cachedKeys = await this.cacheManager.get(KAKAO_PUBLIC_KEY_CAHCE);
    return cachedKeys;
  }

  public async getKakaoUserInfo(accessToken: string) {
    const KAKAO_USER_IFNO_URL = 'https://kapi.kakao.com/v1/oidc/userinfo';
    const response = await this.httpService.axiosRef.get(KAKAO_USER_IFNO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }
}
