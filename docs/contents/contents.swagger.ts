import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ContentsDetailResponseDto } from 'src/domain/contents/dtos/contents-detail-response.dto';
import { ContentsResponseDto } from 'src/domain/contents/dtos/contents-response.dto';
import { ResponseDto } from 'src/global/dtos/response.dto';
import { ContentsLikedResponseDto } from 'src/domain/contents/dtos/contents-liked-response.dto';

export function GetContentsDocs() {
  return applyDecorators(
    ApiTags('Contents'),
    ApiOperation({
      summary: '게시물 전체조회 / 필터별 조회 API 입니다',
      description:
        'Query가 들어오지 않을 시 전체를 조회하며, filter 이름의 쿼리 스트링이 들어올 시 카테고리가 일치하는 게시물만 조회됩니다',
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

export function LikeContentDocs() {
  return applyDecorators(
    ApiTags('ContentLike'),
    ApiOperation({
      summary: '게시물 좋아요',
    }),
    ApiHeader({
      name: 'Authorization',
      description:
        "access token이 필요합니다 key : Authorization, value : 'Bearer ${Token}'",
      schema: {
        example: 'Authorization Bearer ${Access 토큰}',
      },
    }),
    ApiUnauthorizedResponse({
      description: 'access 토큰이 만료된 경우',
      schema: {
        example: ResponseDto.fail(401, '만료된 token.'),
      },
    }),
    ApiBadRequestResponse({
      description: 'header에 토큰이 없는 경우 or token 값 자체가 이상한 경우',
      schema: {
        example: ResponseDto.fail(400, 'token이 필요합니다.'),
      },
    }),
    ApiOkResponse({ type: ContentsLikedResponseDto }),
  );
}

export function UnLikeContentDocs() {
  return applyDecorators(
    ApiTags('ContentLike'),
    ApiOperation({
      summary: '게시물 좋아요 취소',
      description:
        '여러 개의 게시물을 좋아요 취소할 때에는 parameter에 여러 pk를 ,로 분리하여 입력하시면 됩니다',
    }),
    ApiHeader({
      name: 'Authorization',
      description:
        "access token이 필요합니다 key : Authorization, value : 'Bearer ${Token}'",
      schema: {
        example: 'Authorization Bearer ${Access 토큰}',
      },
    }),
    ApiUnauthorizedResponse({
      description: 'access 토큰이 만료된 경우',
      schema: {
        example: ResponseDto.fail(401, '만료된 token.'),
      },
    }),
    ApiBadRequestResponse({
      description: 'header에 토큰이 없는 경우 or token 값 자체가 이상한 경우',
      schema: {
        example: ResponseDto.fail(400, 'token이 필요합니다.'),
      },
    }),
    ApiOkResponse(),
  );
}

export function GetLikedContentsDocs() {
  return applyDecorators(
    ApiTags('ContentLike'),
    ApiOperation({
      summary: '좋아요 한 게시물 목록 조회',
      description:
        'Query가 들어오지 않을 시 전체를 조회하며, filter 이름의 쿼리 스트링이 들어올 시 카테고리가 일치하는 게시물만 조회됩니다',
    }),
    ApiHeader({
      name: 'Authorization',
      description:
        "access token이 필요합니다 key : Authorization, value : 'Bearer ${Token}'",
      schema: {
        example: 'Authorization Bearer ${Access 토큰}',
      },
    }),
    ApiQuery({
      name: 'filter',
      type: 'string',
      description: '카테고리명 (취미 / 진로 / 활동)',
      required: false,
    }),
    ApiUnauthorizedResponse({
      description: 'access 토큰이 만료된 경우',
      schema: {
        example: ResponseDto.fail(401, '만료된 token.'),
      },
    }),
    ApiBadRequestResponse({
      description: 'header에 토큰이 없는 경우 or token 값 자체가 이상한 경우',
      schema: {
        example: ResponseDto.fail(400, 'token이 필요합니다.'),
      },
    }),
    ApiNotFoundResponse({
      description:
        '좋아요를 누른 게시물이 없는 경우: 좋아요를 누른 (${contentsRequestDto.filter}) 게시물이 없습니다',
    }),
    ApiOkResponse({ type: [ContentsLikedResponseDto] }),
  );
}
