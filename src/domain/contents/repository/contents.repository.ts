import { CategoryFilter } from './../dtos/contents-request.dto';
import { Injectable } from '@nestjs/common';
import { ContentsDetailResponseDto } from 'src/domain/contents/dtos/contents-detail-response.dto';
import { PrismaService } from 'src/global/prisma/prima.service';
import { ContentsResponseDto } from '../dtos/contents-response.dto';
import { LikeResponseDTO } from '../dtos/like-response.dto';
import { ContentsLikedResponseDto } from '../dtos/contents-liked-response.dto';

@Injectable()
export class ContentsRepository {
  constructor(private readonly prisma: PrismaService) {}

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
      orderBy: {
        created_at: 'desc',
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
      orderBy: {
        created_at: 'desc',
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

  async getUserTags(user: number) {
    const tags = await this.prisma.userTags.findMany({
      where: {
        user_fk: user,
      },
      include: {
        Tags: {
          select: {
            ContentCategories: {
              select: {
                category: true,
              },
            },
          },
        },
      },
    });

    const result = tags.map((tag) => tag.Tags.ContentCategories.category);

    return result;
  }

  async recommendContents(categories: {}) {
    const filters = Object.keys(categories);

    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateString = `${year}.${month}.${day}`;

    const contents = Promise.all(
      filters.map(async (filter) => {
        const content = await this.prisma.contents.findMany({
          where: {
            category: filter,
            end_at: {
              gte: dateString,
            },
          },
          select: {
            content_pk: true,
            title: true,
            category: true,
            img: true,
            start_at: true,
            end_at: true,
          },
          orderBy: {
            end_at: 'asc',
          },
          take: 5,
        });
        return content;
      }),
    );

    const randomContents = (await contents).map((content) => {
      const shuffle = content.sort(() => 0.5 - Math.random());
      const random = shuffle.slice(0, categories[content[0].category]);
      return random;
    });

    return randomContents;
  }
}
