import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OAuthLoginResponseDto } from 'src/domain/auth/dtos/oauth-login.response.dto';
import { OAuthSignUpResponseDto } from 'src/domain/auth/dtos/oauth-signup.response.dto';
import { ResponseDto } from 'src/global/dtos/response.dto';
import { ApiSuccessResponse } from '../api.success.response';

export function OAuthKakaoLoginDocs() {
  return applyDecorators(
    ApiTags('oauth'),
    ApiOperation({
      summary: '카카오 로그인',
      description:
        'idToken으로 카카오 로그인 시도, oidc 로그인 방식으로 시도합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '회원가입이 필요한 경우 is_new_user: true',
      schema: {
        type: 'object',
        example: OAuthLoginResponseDto.newUser(),
      },
    }),
    ApiSuccessResponse({
      isArray: false,
      exampleDesciption: '로그인 성공',
      model: OAuthLoginResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'token 값이 body에 없거나, 잘못된 토큰인 경우',
      schema: {
        example: ResponseDto.fail(400, '해당 메시지 값'),
      },
    }),
    ApiUnauthorizedResponse({
      description: 'idToken이 만료된 경우, kakao같은 경우 6시간',
      schema: {
        example: ResponseDto.fail(401, '만료된 토큰'),
      },
    }),
  );
}

export function OAuthKakaoSignUpDocs() {
  return applyDecorators(
    ApiTags('oauth'),
    ApiOperation({
      summary: '카카오 회원가입 로그인',
      description:
        '회원가입 프로세스는 idToken으로 검증하고, kakao access토큰으로 name,email을 받고 나머지 data는 body로 받습니다',
    }),
    ApiSuccessResponse({
      isArray: false,
      model: OAuthSignUpResponseDto,
      exampleDesciption: '회원가입 성공',
      status: 201,
    }),
    ApiBadRequestResponse({
      description: 'body의 값이 잘못됐거나 idToken,accessToken이 잘못된 경우',
      schema: {
        example: ResponseDto.fail(400, '해당 메시지 값'),
      },
    }),
    ApiUnauthorizedResponse({
      description: 'idToken이 만료된 경우, kakao같은 경우 6시간',
      schema: {
        example: ResponseDto.fail(401, '만료된 토큰'),
      },
    }),
    ApiConflictResponse({
      description: '이미 가입된 유저인 경우',
      schema: {
        example: ResponseDto.fail(409, '이미 가입된 유저입니다.'),
      },
    }),
  );
}
