import { CategoryFilter } from './../dtos/contents-request.dto';
import { Injectable } from '@nestjs/common';
import { ContentCategories } from '@prisma/client';
import { ContentsDetailResponseDto } from 'src/domain/contents/dtos/contents-detail-response.dto';
import { PrismaService } from 'src/global/prisma/prima.service';
import { ContentsResponseDto } from '../dtos/contents-response.dto';

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
      },
    });

    return contents;
  }

  async getAllContents(): Promise<ContentsResponseDto[]> {
    return await this.prisma.contents.findMany({
      select: {
        content_pk: true,
        title: true,
        category: true,
        img: true,
        start_at: true,
        end_at: true,
      },
    });
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
      select: {
        content_pk: true,
        title: true,
        category: true,
        img: true,
        start_at: true,
        end_at: true,
      },
    });

    return contents;
  }

  async getContentDetail(pk: number): Promise<ContentsDetailResponseDto> {
    const content = await this.prisma.contents.findUnique({
      where: {
        content_pk: pk,
      },
    });

    return content;
  }
}
