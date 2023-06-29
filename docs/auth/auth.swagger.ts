import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshResponseDto } from 'src/domain/auth/dtos/refresh-response.dto';
import { ResponseDto } from 'src/global/dtos/response.dto';
import { ApiSuccessResponse } from '../api.success.response';

export function LogOutDocs() {
  return applyDecorators(
    ApiTags('auth'),
    ApiHeader({
      name: 'Authorization',
      description:
        "access token이 필요합니다 key : Authorization, value : 'Bearer ${Token}'",
      schema: {
        example: 'Authorization Bearer ${Access 토큰}',
      },
    }),
    ApiOperation({
      summary: '로그아웃',
      description: '로그아웃 요청',
    }),
    ApiSuccessResponse({
      isArray: true,
      exampleDesciption: '로그아웃 성공',
      status: 200,
      model: Array,
      isNotValue: true,
    }),
    ApiBadRequestResponse({
      description: 'header에 토큰이 없는 경우 or token 값 자체가 이상한 경우',
      schema: {
        example: ResponseDto.fail(400, 'token이 필요합니다.'),
      },
    }),
    ApiUnauthorizedResponse({
      description: 'access 토큰이 만료된 경우',
      schema: {
        example: ResponseDto.fail(401, '만료된 token.'),
      },
    }),
  );
}

export function RefreshDocs() {
  return applyDecorators(
    ApiTags('auth'),
    ApiHeader({
      name: 'Authorization',
      description:
        "access token이 필요합니다 key : Authorization, value : 'Bearer ${Token}'",
      schema: {
        example: 'Authorization Bearer ${Access 토큰}',
      },
    }),
    ApiSuccessResponse({
      isArray: false,
      exampleDesciption: 'access 토큰 재 발급 성공',
      status: 200,
      model: RefreshResponseDto,
      isNotValue: false,
    }),
    ApiOperation({
      summary: 'refresh 요청',
      description:
        '만료된 access Token을 header에 refresh token을 body에 담아서 주시면 됩니다.',
    }),
    ApiBadRequestResponse({
      description:
        'header에 토큰이 없는 경우 or token 값 자체가 이상한 경우, body에 값이 없는 경우',
      schema: {
        example: ResponseDto.fail(400, 'token이 필요합니다.'),
      },
    }),
    ApiConflictResponse({
      description: '서버에 저장된 refresh 토큰과 일치하지 않는 경우',
      schema: {
        example: ResponseDto.fail(409, '잘못된 refresh token입니다.'),
      },
    }),
  );
}
