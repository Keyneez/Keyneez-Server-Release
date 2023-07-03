import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RefreshResponseDto } from 'src/domain/auth/dtos/refresh-response.dto';
import { ResponseDto } from 'src/global/dtos/response.dto';
import { ApiSuccessResponse } from '../api.success.response';
import { RequireAccessToken } from '../require.access-token';

export function LogOutDocs() {
  return applyDecorators(
    ApiTags('auth'),
    RequireAccessToken(),
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
  );
}

export function RefreshDocs() {
  return applyDecorators(
    ApiTags('auth'),
    RequireAccessToken(),
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
        '만료된 access Token을 header에 refresh token을 body에 담아서 주시면 됩니다.(만료 체크를 하지 않습니다)',
    }),
    ApiConflictResponse({
      description: '서버에 저장된 refresh 토큰과 일치하지 않는 경우',
      schema: {
        example: ResponseDto.fail(409, '잘못된 refresh token입니다.'),
      },
    }),
  );
}

export function WithDrawDocs() {
  return applyDecorators(
    ApiTags('auth'),
    RequireAccessToken(),
    ApiSuccessResponse({
      isArray: false,
      exampleDesciption: '회원 탈퇴 성공',
      status: 200,
      model: Array,
      isNotValue: true,
    }),
    ApiInternalServerErrorResponse({
      description: '카카오 api 서버 or DB 에러',
      schema: {
        example: ResponseDto.fail(500, '서버 에러'),
      },
    }),
  );
}
