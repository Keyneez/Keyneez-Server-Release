import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ContentsDetailResponseDto } from 'src/domain/contents/dtos/contents-detail-response.dto';
import { ContentsResponseDto } from 'src/domain/contents/dtos/contents-response.dto';
import { ContentsLikedResponseDto } from 'src/domain/contents/dtos/contents-liked-response.dto';
import { ApiSuccessResponse } from '../api.success.response';
import { RequireAccessToken } from '../require.access-token';

export function GetContentsDocs() {
  return applyDecorators(
    ApiTags('Contents'),
    ApiOperation({
      summary: '게시물 전체조회 / 필터별 조회 API 입니다',
      description:
        'Query가 들어오지 않을 시 전체를 조회하며, filter 이름의 쿼리 스트링이 들어올 시 카테고리가 일치하는 게시물만 조회됩니다. 최근 업데이트 된 게시물 순서대로 정렬되어 조회됩니다.',
    }),
    RequireAccessToken(),
    ApiQuery({
      name: 'filter',
      type: 'string',
      description: '카테고리명 (취미 / 진로 / 활동)',
      required: false,
    }),
    ApiSuccessResponse({
      model: ContentsResponseDto,
      isArray: true,
      exampleDesciption: '게시글 전체 조회 성공',
    }),
  );
}

export function GetContentDetailDocs() {
  return applyDecorators(
    ApiTags('Contents'),
    ApiOperation({
      summary: '게시물 상세조회 API 입니다.',
    }),
    RequireAccessToken(),
    ApiParam({
      name: 'pk',
      type: 'number',
      description: '게시물 pk',
    }),
    ApiSuccessResponse({
      model: ContentsDetailResponseDto,
      isArray: false,
      exampleDesciption: '게시글 상세 조회 성공',
    }),
  );
}

export function SearchByKeywordDocs() {
  return applyDecorators(
    ApiTags('Contents'),
    ApiOperation({
      summary: '게시물 검색 API 입니다',
    }),
    RequireAccessToken(),
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
    ApiSuccessResponse({
      model: ContentsResponseDto,
      isArray: true,
      exampleDesciption: '게시글 검색 성공',
    }),
  );
}

export function LikeContentDocs() {
  return applyDecorators(
    ApiTags('ContentLike'),
    ApiOperation({
      summary: '게시물 좋아요',
    }),
    RequireAccessToken(),
    ApiParam({
      name: 'pk',
      type: 'number',
      description: '게시물 pk',
    }),
    ApiSuccessResponse({
      model: ContentsLikedResponseDto,
      isArray: false,
      exampleDesciption: '게시글 좋아요 성공',
    }),
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
    RequireAccessToken(),
    ApiBadRequestResponse({
      description:
        'parameter에 number가 아닌 값이 포함된 경우 ex) 1,2,hi,3 : `Invalid parameter : ${pk}`',
    }),
    ApiParam({
      name: 'pk',
      type: 'number[]',
      description: '게시물 pk 리스트 or 게시물 pk : ex. 1,2,3 or 4',
    }),
    ApiSuccessResponse({
      model: Array,
      isArray: true,
      exampleDesciption: '게시글 좋아요 취소 성공',
      isNotValue: true,
    }),
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
    RequireAccessToken(),
    ApiQuery({
      name: 'filter',
      type: 'string',
      description: '카테고리명 (취미 / 진로 / 활동)',
      required: false,
    }),
    ApiNotFoundResponse({
      description:
        '좋아요를 누른 게시물이 없는 경우: 좋아요를 누른 (${contentsRequestDto.filter}) 게시물이 없습니다',
    }),
    ApiSuccessResponse({
      model: ContentsLikedResponseDto,
      isArray: true,
      exampleDesciption: '좋아요한 게시글 조회 성공',
    }),
  );
}

export function RecommendContentsDocs() {
  return applyDecorators(
    ApiTags('Contents'),
    ApiOperation({
      summary: '추천 게시물 조회 API 입니다',
    }),
    RequireAccessToken(),
    ApiQuery({
      name: 'keyword',
      type: 'string',
      description: '검색 키워드',
      required: true,
    }),
    ApiSuccessResponse({
      model: ContentsResponseDto,
      isArray: true,
      exampleDesciption: '추천 게시물 조회 성공',
    }),
  );
}
