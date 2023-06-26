import { ApiProperty } from '@nestjs/swagger';
import { TagAndCategory } from '../repository/tag.repository';

export class TagResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'tag id',
  })
  tag_pk: number;

  @ApiProperty({
    type: String,
    example: '동아리/서포터즈',
    description: '태그 내용',
  })
  tag: string;

  @ApiProperty({
    type: String,
    example: '활동',
    description: '태그의 카테고리',
  })
  category: string;

  constructor(tags: TagAndCategory) {
    this.tag_pk = tags.tag_pk;
    this.tag = tags.tag;
    this.category = tags.ContentCategories.category;
  }
}
