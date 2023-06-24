import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ContentsLikedResponseDto {
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
}
