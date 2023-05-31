import { ContentsRequestDto } from './../dto/contents/contents-request.dto';
import { ContentsResponseDto } from './../dto/contents/contents-response.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './../global/prisma/prima.service';

export enum Filter {
  취미 = 1,
  진로 = 2,
  활동 = 3,
}

@Injectable()
export class ContentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getContents(contentsRequestDto: ContentsRequestDto) {
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
      return contents;
    }

    return this.prisma.contents.findMany();
  }
}
