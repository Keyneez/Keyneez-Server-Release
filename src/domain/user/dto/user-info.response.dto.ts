import { Users } from '@prisma/client';

export class UserInfoResponseDto {
  readonly user_pk: number;
  readonly name: string;
  readonly nickname: string;
  readonly email: string;
  readonly gender: string;
  readonly birth: string;
  readonly sns_type: string;
  readonly created_at: Date;
  readonly updated_at: Date;

  constructor(user: Users) {
    this.user_pk = user.user_pk;
    this.name = user.name;
    this.nickname = user.nickname;
    this.email = user.email;
    this.gender = user.gender;
    this.birth = user.birth;
    this.sns_type = user.sns_type;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
  }
}
