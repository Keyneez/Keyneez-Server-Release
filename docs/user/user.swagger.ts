import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserInfoResponseDto } from 'src/domain/user/dtos/user-info.response.dto';
import { ApiSuccessResponse } from '../api.success.response';
import { RequireAccessToken } from '../require.access-token';

export function GetUserInfoDocs() {
  return applyDecorators(
    ApiTags('user'),
    RequireAccessToken(),
    ApiOperation({
      summary: '유저 정보 조회',
      description: 'access 토큰으로 유저 정보를 조회합니다.',
    }),
    ApiSuccessResponse({
      isArray: false,
      model: UserInfoResponseDto,
      status: 200,
      exampleDesciption: '유저 조회 성공',
    }),
  );
}
