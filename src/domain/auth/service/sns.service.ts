import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OidcPublicKeyDto } from '../dtos/oidc.public-key.dto';
import { TokenService } from './token.service';
import { OAuthUserTypeDto } from '../dtos/oauth-user-type.dto';
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

    if (!this.validateOauthAgree(payload)) {
      await this.unlinkKakao(payload.sub);
      throw new ConflictException('동의항목을 모두 동의해주세요');
    }

    return new OAuthUserTypeDto('KAKAO', payload.sub, payload.email);
  }

  private validateOauthAgree(payload): boolean {
    return payload.email ? true : false;
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

  async unlinkKakao(snsId: string) {
    const UNLINK_URL = `https://kapi.kakao.com/v1/user/unlink?target_id_type=user_id&target_id=${snsId}`;
    await this.httpService.axiosRef.post(
      UNLINK_URL,
      {},
      {
        headers: {
          Authorization: `KakaoAK ${this.config.kakaoAdminKey}`,
        },
      },
    );
  }
}
