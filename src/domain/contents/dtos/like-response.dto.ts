import { ApiProperty } from '@nestjs/swagger';

export class LikeResponseDTO {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'liked pk',
  })
  readonly liked_pk: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'user pk',
  })
  readonly user: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'content pk',
  })
  readonly content: number;
}
