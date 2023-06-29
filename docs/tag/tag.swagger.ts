import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagResponseDto } from '../../src/domain/tags/dtos/tag.response.dto';
import { ApiSuccessResponse } from '../api.success.response';

export function GetAllTagDocs() {
  return applyDecorators(
    ApiTags('tag'),
    ApiOperation({
      summary: '성향 태그 전체 조회',
      description: '회원가입 전 태그 데이터 전체 조회를 위한 API 입니다',
    }),
    ApiSuccessResponse({
      isArray: true,
      exampleDesciption: '태그 조회 성공',
      model: TagResponseDto,
    }),
  );
}
