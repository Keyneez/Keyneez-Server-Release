import { CategoryFilter } from './../dtos/contents-request.dto';
import { Injectable } from '@nestjs/common';
import { ContentCategories } from '@prisma/client';
import { ContentsResponseDto } from 'src/domain/contents/dtos/contents-response.dto';
import { PrismaService } from 'src/global/prisma/prima.service';

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

  async getFilteredContents(filter: CategoryFilter) {
    const contents = await this.prisma.contents.findMany({
      where: {
        category: filter,
      },
    });
    return contents;
  }

  async getAllContents() {
    return this.prisma.contents.findMany();
  }

  async searchByKeyword(keyword: string): Promise<ContentsResponseDto[]> {
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
    });
    return contents;
  }

  async getContentDetail(pk: number) {
    const content = await this.prisma.contents.findUnique({
      where: {
        content_pk: pk,
      },
    });

    return content;
  }
}
