import { Injectable } from '@nestjs/common';
import { OAuthUserTypeDto } from 'src/domain/auth/dto/oauth-user-type.dto';
import { PrismaService } from 'src/global/prisma/prima.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByOAuthUserType(oauthUser: OAuthUserTypeDto) {
    const { snsId, snsType } = oauthUser;
    return await this.prisma.users.findUnique({
      where: {
        sns_identifer: {
          sns_id: snsId,
          sns_type: snsType,
        },
      },
    });
  }

  async updateRefreshToken(userPk: number, refreshToken: string) {
    await this.prisma.users.update({
      where: {
        user_pk: userPk,
      },
      data: {
        refresh_token: refreshToken,
      },
    });
  }

  async findByPk(pk: number) {
    return await this.prisma.users.findUnique({
      where: {
        user_pk: pk,
      },
    });
  }

  async create(
    oauthUser: OAuthUserTypeDto,
    nickname: string,
    name: string,
    email: string,
    age: number,
    gender: string,
    birth: string,
  ) {
    return await this.prisma.users.create({
      data: {
        sns_id: oauthUser.snsId,
        sns_type: oauthUser.snsType,
        name,
        nickname,
        email,
        age,
        gender,
        phone: '이거미정',
        birth,
      },
    });
  }
}
