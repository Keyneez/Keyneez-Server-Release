import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsInt,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class OAuthSignUpRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'oauth id token',
  })
  @IsString()
  id_token: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'oauth access Token',
  })
  @IsString()
  access_token: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '닉네임',
    description: '영어,한글,숫자만 가능한 2-6글자 ',
  })
  @IsString()
  @Matches(/^[a-zA-Z가-힣0-9]{2,6}$/, { message: '닉네임 값을 확인해주세요' })
  nickname: string;

  @ApiProperty({
    type: String,
    required: true,
    description:
      '성별, 여자는 F, 남자는 M,그외는 O 로 주세요, Female, Male, Other',
    example: 'M',
  })
  @IsString()
  @Transform(({ value }) => {
    if (value === 'M' || value === 'F' || value === 'O') {
      return value;
    }
    throw new BadRequestException('성별 값을 확인해주세요!');
  })
  gender: string;

  @ApiProperty({
    type: String,
    required: true,
    description: '생일 값, string으로 주세요(포맷 미지정)',
  })
  @IsString()
  birth: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 25,
    description: '나이',
  })
  @IsInt()
  age: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: '[1,2,3]',
    description: '태그 pk 값',
  })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      throw new BadRequestException('tag_pks feild is not array');
    }
    const distinct = [...new Set(value.map((v) => v))];
    if (value.length != distinct.length) {
      throw new BadRequestException('not allow duplicate vlaue');
    }
    return value;
  })
  @IsNumber({}, { each: true })
  @ArrayMaxSize(3)
  @ArrayMinSize(3)
  tag_pks: number[];
}
