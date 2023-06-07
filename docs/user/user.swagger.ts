import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserInfoResponseDto } from 'src/domain/user/dto/user-info.response.dto';
import { ResponseDto } from 'src/global/dtos/response.dto';

export function GetUserInfoDocs() {
  return applyDecorators(
    ApiTags('user'),
    ApiHeader({
      name: 'Authorization',
      description:
        "access token이 필요합니다 key : Authorization, value : 'Bearer ${Token}'",
      schema: {
        example: 'Authorization Bearer ${Access 토큰}',
      },
    }),
    ApiOkResponse({
      description: '유저 정보 조회 성공',
      type: UserInfoResponseDto,
    }),
    ApiOperation({
      summary: '유저 정보 조회',
      description: 'access 토큰으로 유저 정보를 조회합니다.',
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
