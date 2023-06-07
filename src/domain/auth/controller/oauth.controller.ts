import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ResponseDto } from 'src/global/dtos/response.dto';
import { OAuthLoginRequestDto } from '../dto/oauth-login.requst.dto';
import { OAuthService } from '../service/oauth.service';
import { OAuthSignUpRequestDto } from '../dto/oauth-signup.request.dto';
import {
  OAuthKakaoLoginDocs,
  OAuthKakaoSignUpDocs,
} from 'docs/auth/oauth.swagger';

@Controller('/api')
export class OAuthController {
  constructor(private oauthService: OAuthService) {}

  @Post('/oauth/kakao')
  @OAuthKakaoLoginDocs()
  async kakaoLogin(@Body() requestBody: OAuthLoginRequestDto) {
    const { id_token: idToken } = requestBody;
    const result = await this.oauthService.oauthKakaoLogin(idToken);
    return ResponseDto.okWithData(HttpStatus.OK, 'OAuth Login', result);
  }

  @Post('/oauth/kakao/sign-up')
  @OAuthKakaoSignUpDocs()
  async kakaoSignUp(@Body() requestBody: OAuthSignUpRequestDto) {
    const result = await this.oauthService.kakaoOauthSignup(requestBody);
    return ResponseDto.okWithData(
      HttpStatus.CREATED,
      'OAuth 회원가입 성공',
      result,
    );
  }
}
