import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description: '새로 발급한 access 토큰',
  })
  readonly access_token: string;

  constructor(token: string) {
    this.access_token = token;
  }
}
