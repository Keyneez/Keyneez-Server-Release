import { CategoryFilter } from './../dtos/contents-request.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ContentCategories } from '@prisma/client';
import { ContentsDetailResponseDto } from 'src/domain/contents/dtos/contents-detail-response.dto';
import { PrismaService } from 'src/global/prisma/prima.service';
import { ContentsResponseDto } from '../dtos/contents-response.dto';
import { LikeResponseDTO } from '../dtos/like-response.dto';
import { ContentsLikedResponseDto } from '../dtos/contents-liked-response.dto';

@Injectable()
export class ContentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCategoryPk(filter: string): Promise<ContentCategories> {
    const category = await this.prisma.contentCategories.findUnique({
      where: {
        category: filter,
      },
    });

    return category;
  }

  async getFilteredContents(
    user: number,
    filter: CategoryFilter,
  ): Promise<ContentsResponseDto[]> {
    const contents = await this.prisma.contents.findMany({
      where: {
        category: filter,
      },
      select: {
        content_pk: true,
        title: true,
        category: true,
        img: true,
        start_at: true,
        end_at: true,
        Likes: {
          where: {
            user,
          },
        },
      },
    });

    return contents;
  }

  async getAllContents(user: number): Promise<ContentsResponseDto[]> {
    return await this.prisma.contents.findMany({
      select: {
        content_pk: true,
        title: true,
        category: true,
        img: true,
        start_at: true,
        end_at: true,
        Likes: {
          where: {
            user,
          },
        },
      },
    });
  }

  async searchByKeyword(
    user: number,
    keyword: string,
  ): Promise<ContentsResponseDto[]> {
    const contents = await this.prisma.contents.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            introduction: {
              contains: keyword,
            },
          },
          {
            place: {
              contains: keyword,
            },
          },
        ],
      },
      select: {
        content_pk: true,
        title: true,
        category: true,
        img: true,
        start_at: true,
        end_at: true,
        Likes: {
          where: {
            user,
          },
        },
      },
    });

    return contents;
  }

  async getContentDetail(
    user: number,
    pk: number,
  ): Promise<ContentsDetailResponseDto> {
    const content = await this.prisma.contents.findUnique({
      where: {
        content_pk: pk,
      },
      include: {
        Likes: {
          where: {
            user,
          },
        },
      },
    });

    return content;
  }

  async isLiked(user: number, content: number): Promise<LikeResponseDTO> {
    const liked = await this.prisma.likes.findFirst({
      where: {
        user,
        content,
      },
    });

    return liked;
  }

  async likeContent(user: number, content: number): Promise<LikeResponseDTO> {
    const like = await this.prisma.likes.create({
      data: {
        user,
        content,
      },
    });

    return like;
  }

  async unlikeContent(user: number, contents: number[]): Promise<void> {
    for (const content of contents) {
      await this.prisma.likes.delete({
        where: {
          likes_userid: {
            user,
            content,
          },
        },
      });
    }
  }

  async getFilteredLikedContents(
    user: number,
    filter: string,
  ): Promise<ContentsLikedResponseDto[]> {
    const contents = await this.prisma.likes.findMany({
      where: {
        user,
        Contents: {
          category: filter,
        },
      },
      select: {
        Contents: {
          select: {
            content_pk: true,
            title: true,
            category: true,
            img: true,
            start_at: true,
            end_at: true,
          },
        },
      },
    });

    const result = contents.map((content) => content.Contents);

    return result;
  }

  async getLikedContents(user: number): Promise<ContentsLikedResponseDto[]> {
    const contents = await this.prisma.likes.findMany({
      where: {
        user,
      },
      include: {
        Contents: {
          select: {
            content_pk: true,
            title: true,
            category: true,
            img: true,
            start_at: true,
            end_at: true,
          },
        },
      },
    });

    const result = contents.map((content) => {
      return content.Contents;
    });

    return result;
  }
}
