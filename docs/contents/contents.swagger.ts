import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ContentsDetailResponseDto } from 'src/domain/contents/dtos/contents-detail-response.dto';
import { ContentsResponseDto } from 'src/domain/contents/dtos/contents-response.dto';

export function GetContentsDocs() {
  return applyDecorators(
    ApiTags('Contents'),
    ApiOperation({
      summary:
        '게시물 전체조회 / 필터별 조회 API 입니다. Query가 들어오지 않을 시 전체를 조회하며, filter 이름의 쿼리 스트링이 들어올 시 카테고리가 일치하는 게시물만 조회됩니다',
    }),
    ApiQuery({
      name: 'filter',
      type: 'string',
      description: '카테고리명 (취미 / 진로 / 활동)',
      required: false,
    }),
    ApiOkResponse({ type: [ContentsResponseDto] }),
  );
}

export function GetContentDetailDocs() {
  return applyDecorators(
    ApiTags('Contents'),
    ApiOperation({
      summary: '게시물 상세조회 API 입니다.',
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: '게시물 id',
    }),
    ApiOkResponse({ type: ContentsDetailResponseDto }),
  );
}

export function SearchByKeywordDocs() {
  return applyDecorators(
    ApiTags('Contents'),
    ApiOperation({
      summary: '게시물 검색 API 입니다',
    }),
    ApiQuery({
      name: 'keyword',
      type: 'string',
      description: '검색 키워드',
      required: true,
    }),
    ApiNotFoundResponse({
      description:
        "keyword가 포함된 게시물이 없을 때: 'Not found contents including keyword: ' + ${keyword}'",
    }),
    ApiOkResponse({ type: [ContentsResponseDto] }),
  );
}
