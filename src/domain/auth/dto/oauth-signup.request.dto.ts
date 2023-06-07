import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsInt, IsString, Matches } from 'class-validator';

export class OAuthSignUpRequestDto {
  @IsString()
  id_token: string;

  @IsString()
  access_token: string;

  @IsString()
  @Matches(/^[a-z가-힣0-9]{2,6}$/, { message: '닉네임 값을 확인해주세요' })
  nickname: string;

  @IsString()
  @Transform(({ value, obj }) => {
    if (value === 'M' || value === 'F') {
      return value;
    }
    throw new BadRequestException('성별 값을 확인해주세요!');
  })
  gender: string;

  @IsString()
  birth: string;

  @IsInt()
  age: number;
}
