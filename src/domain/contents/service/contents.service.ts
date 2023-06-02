import { ContentsRepository } from '../repository/contents.repository';
import { GetContentsRequestDto } from '../../../dto/contents/contents-request.dto';
import { ContentsResponseDto } from '../../../dto/contents/contents-response.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ContentsService {
  constructor(private readonly contentsRepository: ContentsRepository) {}

  async getContents(
    contentsRequestDto: GetContentsRequestDto,
  ): Promise<ContentsResponseDto[]> {
    if (contentsRequestDto.filter) {
      const filter = await this.contentsRepository.findCategoryPk(
        contentsRequestDto.filter,
      );

      const contents = await this.contentsRepository.getFilteredContents(
        filter,
      );
      const data = contents.map((content) => content.Contents);
      return data;
    }

    return await this.contentsRepository.getAllContents();
  }

  async searchByKeyword(keyword: string): Promise<ContentsResponseDto[]> {
    const contents = await this.contentsRepository.searchByKeyword(keyword);
    if (!contents[0]) {
      throw new NotFoundException(
        'Not found contents including keyword: ' + keyword,
      );
    }
    return contents;
  }

  async getContentDetail(pk: number): Promise<ContentsResponseDto> {
    const content = await this.contentsRepository.getContentDetail(pk);

    return content;
  }
}
