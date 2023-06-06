import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ResponseDto } from 'src/global/dtos/response.dto';
import { OAuthLoginRequestDto } from '../dto/oauth-login.requst.dto';
import { OAuthService } from '../service/oauth.service';
import { OAuthSignUpRequestDto } from '../dto/oauth-signup.request.dto';

@Controller('/api/oauth')
export class OAuthController {
  constructor(private oauthService: OAuthService) {}

  @Post('/kakao')
  async kakaoLogin(@Body() requestBody: OAuthLoginRequestDto) {
    const { idToken } = requestBody;
    const result = await this.oauthService.oauthKakaoLogin(idToken);
    return ResponseDto.okWithData(HttpStatus.OK, 'OAuth Login', result);
  }

  @Post('/kakao/sign-up')
  async kakaoSignUp(@Body() requestBody: OAuthSignUpRequestDto) {
    const result = await this.oauthService.kakaoOauthSignup(requestBody);
    return ResponseDto.okWithData(
      HttpStatus.CREATED,
      'OAuth 회원가입 성공',
      result,
    );
  }
}
