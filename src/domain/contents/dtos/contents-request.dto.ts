import { ApiProperty } from '@nestjs/swagger';

export enum CategoryFilter {
  취미 = '취미',
  진로 = '진로',
  활동 = '활동',
}

export class GetContentsRequestDto {
  @ApiProperty({
    type: CategoryFilter,
    required: false,
    description:
      'Filter(취미, 활동, 진로), 전체를 불러올땐 아무값도 안넣으면 됩니다.',
  })
  filter?: CategoryFilter;
}
