import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ResponseDto } from 'src/global/dtos/response.dto';
import { OAuthLoginRequestDto } from '../dto/oauth-login.requst.dto';
import { OAuthService } from '../service/oauth.service';

@Controller()
export class OAuthController {
  constructor(private oauthService: OAuthService) {}

  @Get('/test')
  test() {
    return ResponseDto.ok(HttpStatus.OK, '테스틍');
  }

  @Post('/oauth/kakao')
  async kakaoLogin(@Body() requestBody: OAuthLoginRequestDto) {
    const { idToken } = requestBody;
    const result = await this.oauthService.oauthLogin(idToken);
    return ResponseDto.okWithData(HttpStatus.OK, 'OAuth Login', result);
  }
}
