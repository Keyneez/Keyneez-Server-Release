import { ApiProperty } from '@nestjs/swagger';

export class ContentsRequestDto {
  @ApiProperty({
    type: String,
    required: false,
    description:
      'Filter(취미, 활동, 진로), 전체를 불러올땐 아무값도 안넣으면 됩니다.',
  })
  filter?: string;
}
