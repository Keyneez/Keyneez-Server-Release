import { Users } from '@prisma/client';

export class UserInfoResponseDto {
  readonly userPk: number;
  readonly name: string;
  readonly nickname: string;
  readonly email: string;
  readonly gender: string;
  readonly birth: string;
  readonly snsType: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(user: Users) {
    this.userPk = user.user_pk;
    this.name = user.name;
    this.nickname = user.nickname;
    this.email = user.email;
    this.gender = user.gender;
    this.birth = user.birth;
    this.snsType = user.sns_type;
    this.createdAt = user.created_at;
    this.updatedAt = user.updated_at;
  }
}
