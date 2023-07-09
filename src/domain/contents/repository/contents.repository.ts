import { CategoryFilter } from './../dtos/contents-request.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prima.service';
import { LikeResponseDTO } from '../dtos/like-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getFilteredContents(user: number, filter: CategoryFilter) {
    const contents = await this.prisma.contents.findMany({
      where: {
        category: filter,
      },
      include: {
        ContentCategories: true,
        Tags: true,
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

  async getAllContents(user: number) {
    return await this.prisma.contents.findMany({
      include: {
        ContentCategories: true,
        Tags: true,
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

  async searchByKeyword(user: number, keyword: string) {
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
      include: {
        ContentCategories: true,
        Tags: true,
        Likes: {
          where: {
            user,
          },
        },
      },
    });

    return contents;
  }

  async getContentDetail(user: number, pk: number) {
    const content = await this.prisma.contents.findUnique({
      where: {
        content_pk: pk,
      },
      include: {
        ContentCategories: true,
        Tags: true,
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

  async getFilteredLikedContents(user: number, filter: string) {
    const contents = await this.prisma.likes.findMany({
      where: {
        user,
        Contents: {
          category: filter,
        },
      },
      select: {
        Contents: {
          include: {
            ContentCategories: true,
            Tags: true,
          },
        },
      },
    });

    const result = contents.map((content) => content.Contents);

    return result;
  }

  async getLikedContents(user: number) {
    const contents = await this.prisma.likes.findMany({
      where: {
        user,
      },
      include: {
        Contents: {
          include: {
            ContentCategories: true,
            Tags: true,
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
          include: {
            ContentCategories: {
              select: {
                img: true,
              },
            },
            Tags: {
              select: {
                img: true,
              },
            },
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

export type FilterTagLike = Prisma.ContentsGetPayload<{
  include: {
    ContentCategories: true;
    Tags: true;
    Likes: {
      where: {
        user: number;
      };
    };
  };
}>;

export type FilterAndTag = Prisma.ContentsGetPayload<{
  include: {
    ContentCategories: true;
    Tags: true;
  };
}>;
