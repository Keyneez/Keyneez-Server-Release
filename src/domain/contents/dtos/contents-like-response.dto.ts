import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ContentsLikeResponseDTO {
  @ApiProperty({
    type: Number,
    required: true,
    description: '게시물 id',
  })
  @IsNumber()
  readonly liked_pk: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: '게시물 id',
  })
  @IsNumber()
  readonly user: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: '게시물 id',
  })
  @IsNumber()
  readonly content: number;
}
