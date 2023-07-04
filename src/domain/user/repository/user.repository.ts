import { Injectable } from '@nestjs/common';
import { OAuthUserTypeDto } from 'src/domain/auth/dtos/oauth-user-type.dto';
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
    age: number,
    gender: string,
    birth: string,
    tagPks: number[],
  ) {
    const tags = tagPks.map((tagPk) => {
      return {
        tag_fk: tagPk,
      };
    });

    const { snsId, snsType, email } = oauthUser;

    return await this.prisma.users.create({
      data: {
        sns_id: snsId,
        sns_type: snsType,
        nickname,
        email,
        age,
        gender,
        birth,
        UserTags: {
          createMany: {
            data: tags,
          },
        },
      },
    });
  }

  async delete(tx, userPk: number) {
    await tx.users.delete({
      where: {
        user_pk: userPk,
      },
    });
  }
}
