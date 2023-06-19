import { ContentsRepository } from '../repository/contents.repository';
import { GetContentsRequestDto } from '../dtos/contents-request.dto';
import { ContentsDetailResponseDto } from '../dtos/contents-detail-response.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentsResponseDto } from '../dtos/contents-response.dto';

@Injectable()
export class ContentsService {
  constructor(private readonly contentsRepository: ContentsRepository) {}

  async getContents(
    contentsRequestDto: GetContentsRequestDto,
  ): Promise<ContentsResponseDto[]> {
    if (contentsRequestDto.filter) {
      const contents = await this.contentsRepository.getFilteredContents(
        contentsRequestDto.filter,
      );
      return contents;
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

  async getContentDetail(pk: number): Promise<ContentsDetailResponseDto> {
    const content = await this.contentsRepository.getContentDetail(pk);

    return content;
  }
}
