import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';

export class UserInfoResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'user id',
  })
  readonly user_pk: number;

  @ApiProperty({
    type: String,
    example: '닉네임',
    description: '닉네임',
  })
  readonly nickname: string;

  @ApiProperty({
    type: String,
    example: 'email@eamil.com',
    description: '이메일',
  })
  readonly email: string;

  @ApiProperty({
    type: String,
    example: 'M',
    description: '성별',
  })
  readonly gender: string;

  @ApiProperty({
    type: String,
    description: '생일',
  })
  readonly birth: string;

  @ApiProperty({
    type: String,
    example: 'KAKAO',
    description: 'sns 유형, kakao인지, apple인지',
  })
  readonly sns_type: string;

  @ApiProperty({
    type: Date,
    description: '가입 날짜',
  })
  readonly created_at: Date;

  @ApiProperty({
    type: Date,
    description: '업데이트 날짜',
  })
  readonly updated_at: Date;

  constructor(user: Users) {
    this.user_pk = user.user_pk;
    this.nickname = user.nickname;
    this.email = user.email;
    this.gender = user.gender;
    this.birth = user.birth;
    this.sns_type = user.sns_type;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
  }
}
