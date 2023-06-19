import { ContentsRepository } from '../repository/contents.repository';
import { GetContentsRequestDto } from '../dtos/contents-request.dto';
import { ContentsDetailResponseDto } from '../dtos/contents-detail-response.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ContentsResponseDto } from '../dtos/contents-response.dto';
import { ContentsLikeResponseDTO } from '../dtos/contents-like-response.dto';

@Injectable()
export class ContentsService {
  constructor(private readonly contentsRepository: ContentsRepository) {}

  async getContents(user: number, contentsRequestDto: GetContentsRequestDto) {
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

  async getLikedContents(user: number): Promise<ContentsResponseDto[]> {
    const likedContents = this.contentsRepository.getLikedContents(user);
    return likedContents;
  }

  async getContentDetail(pk: number): Promise<ContentsDetailResponseDto> {
    const content = await this.contentsRepository.getContentDetail(pk);

    return content;
  }

  async likeContent(
    user: number,
    content: number,
  ): Promise<ContentsLikeResponseDTO> {
    const liked = await this.contentsRepository.isLiked(user, content);

    if (!liked) {
      const like = await this.contentsRepository.likeContent(user, content);
      return like;
    }

    throw new BadRequestException('already liked');
  }
}
