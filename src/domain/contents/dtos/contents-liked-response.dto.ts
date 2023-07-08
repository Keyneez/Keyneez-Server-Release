import { FilterAndTag } from './../repository/contents.repository';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Contents } from '@prisma/client';

// import { FilterAndTag } from '../repository/contents.repository';

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
    nullable: true,
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

  constructor(content: Contents, filter_tag: FilterAndTag) {
    this.content_pk = content.content_pk;
    this.title = content.title;
    this.category = content.category;
    this.start_at = content.start_at;
    this.end_at = content.end_at;
    this.img = filter_tag.Tags
      ? filter_tag.Tags.img
      : filter_tag.ContentCategories.img;
  }
}
