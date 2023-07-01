import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Like } from './contents-response.dto';

export class ContentsDetailResponseDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: '게시물 id',
  })
  @IsNumber()
  readonly content_pk: number;

  @ApiProperty({
    type: String,
    nullable: false,
    description: '게시물 제목',
  })
  readonly title: string;

  @ApiProperty({
    type: String,
    nullable: false,
    description: '게시물 카테고리',
  })
  readonly category: string;

  @ApiProperty({
    type: String,
    nullable: false,
    description: '게시물 태그',
  })
  readonly tag: string;

  @ApiProperty({
    type: String,
    nullable: false,
    description: '원본 사이트 링크',
  })
  readonly link: string;

  @ApiProperty({
    type: String,
    nullable: false,
    description: '메인 이미지 주소',
  })
  readonly img: string;

  @ApiProperty({
    type: String,
    nullable: false,
    description: '장소 정보',
  })
  readonly place: string;

  @ApiProperty({
    type: String,
    nullable: false,
    description: '활동 설명',
  })
  readonly introduction: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: '혜택 시작 일자',
  })
  readonly start_at: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: '혜택 종료 일자',
  })
  readonly end_at: string;

  @ApiProperty({
    type: String,
    nullable: false,
    description: '문의 정보',
  })
  readonly inquiry: string[];

  @ApiProperty({
    type: String,
    nullable: false,
    description: '참가비',
  })
  readonly price: string[];

  @ApiProperty({
    type: String,
    nullable: false,
    description: '청소년 혜택',
  })
  readonly benefit: string[];

  @ApiProperty({
    type: Date,
    nullable: false,
    description: '생성일자',
  })
  readonly created_at: Date;

  @ApiProperty({
    type: String,
    nullable: false,
    description: '수정 일자',
  })
  readonly updated_at: Date;

  @ApiProperty({
    type: [Like],
    nullable: false,
    description: '좋아요 정보(없을 경우 빈 리스트)',
  })
  readonly Likes: Like[];
}
