import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../global/prisma/prima.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagRepository {
  constructor(private prisma: PrismaService) {}

  async findAllWithCategory(): Promise<TagAndCategory[]> {
    return await this.prisma.tags.findMany({
      include: {
        ContentCategories: true,
      },
    });
  }
}

export type TagAndCategory = Prisma.TagsGetPayload<{
  include: {
    ContentCategories: true;
  };
}>;
