import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class Like {
  @ApiProperty({
    type: Number,
    nullable: false,
    description: '좋아요 정보 key',
  })
  readonly liked_pk: number;

  @ApiProperty({
    type: Number,
    nullable: false,
    description: '좋아요 누른 유저 Pk',
  })
  readonly user: number;

  @ApiProperty({
    type: Number,
    nullable: false,
    description: '좋아요 눌린 게시물 Pk',
  })
  readonly content: number;
}

export class ContentsResponseDto {
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
    description: '메인 이미지 주소',
  })
  readonly img: string;

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
    type: [Like],
    nullable: false,
    description: '좋아요 정보(없을 경우 빈 리스트)',
  })
  readonly Likes: Like[];
}
