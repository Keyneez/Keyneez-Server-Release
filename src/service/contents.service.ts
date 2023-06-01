import { ContentsRequestDto } from './../dto/contents/contents-request.dto';
import { ContentsResponseDto } from './../dto/contents/contents-response.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './../global/prisma/prima.service';

export enum Filter {
  취미 = 1,
  진로 = 2,
  활동 = 3,
}

@Injectable()
export class ContentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getContents(
    contentsRequestDto: ContentsRequestDto,
  ): Promise<ContentsResponseDto[]> {
    if (contentsRequestDto.filter) {
      const filter = Filter[contentsRequestDto.filter as keyof typeof Filter];
      const contents = await this.prisma.contentMapping.findMany({
        where: {
          category: filter,
        },
        include: {
          Contents: true,
        },
      });
      const data = contents.map((content) => content.Contents);
      return data;
    }

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
    if (!contents[0]) {
      throw new NotFoundException(
        'Not found contents including keyword: ' + keyword,
      );
    }
    return contents;
  }

  async getContentDetail(id: number): Promise<ContentsResponseDto> {
    const content = await this.prisma.contents.findUnique({
      where: {
        content_pk: id,
      },
    });

    return content;
  }
}
