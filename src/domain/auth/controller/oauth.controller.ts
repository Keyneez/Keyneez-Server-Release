import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ResponseDto } from 'src/global/dtos/response.dto';
import { OAuthLoginRequestDto } from '../dto/oauth-login.requst.dto';
import { OAuthService } from '../service/oauth.service';
import { OAuthSignUpRequestDto } from '../dto/oauth-signup.request.dto';
import { JwtAuthUser, User } from 'src/global/decorators/jwt.decorator';

@Controller('/api')
export class OAuthController {
  constructor(private oauthService: OAuthService) {}

  @Post('/oauth/kakao')
  async kakaoLogin(@Body() requestBody: OAuthLoginRequestDto) {
    const { idToken } = requestBody;
    const result = await this.oauthService.oauthKakaoLogin(idToken);
    return ResponseDto.okWithData(HttpStatus.OK, 'OAuth Login', result);
  }

  @Post('/oauth/kakao/sign-up')
  async kakaoSignUp(@Body() requestBody: OAuthSignUpRequestDto) {
    const result = await this.oauthService.kakaoOauthSignup(requestBody);
    return ResponseDto.okWithData(
      HttpStatus.CREATED,
      'OAuth 회원가입 성공',
      result,
    );
  }
}