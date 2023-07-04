import { ContentsRepository } from '../repository/contents.repository';
import { GetContentsRequestDto } from '../dtos/contents-request.dto';
import { ContentsDetailResponseDto } from '../dtos/contents-detail-response.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ContentsResponseDto } from '../dtos/contents-response.dto';
import { LikeResponseDTO } from '../dtos/like-response.dto';
import { ContentsLikedResponseDto } from '../dtos/contents-liked-response.dto';

@Injectable()
export class ContentsService {
  constructor(private readonly contentsRepository: ContentsRepository) {}

  async getContents(user: number, contentsRequestDto: GetContentsRequestDto) {
    if (contentsRequestDto.filter) {
      const contents = await this.contentsRepository.getFilteredContents(
        user,
        contentsRequestDto.filter,
      );
      return contents;
    }

    return await this.contentsRepository.getAllContents(user);
  }

  async searchByKeyword(
    user: number,
    keyword: string,
  ): Promise<ContentsResponseDto[]> {
    const contents = await this.contentsRepository.searchByKeyword(
      user,
      keyword,
    );
    if (!contents[0]) {
      throw new NotFoundException(
        'Not found contents including keyword: ' + keyword,
      );
    }
    return contents;
  }

  async getLikedContents(
    user: number,
    contentsRequestDto: GetContentsRequestDto,
  ): Promise<ContentsLikedResponseDto[]> {
    if (contentsRequestDto.filter) {
      const contents = await this.contentsRepository.getFilteredLikedContents(
        user,
        contentsRequestDto.filter,
      );

      if (!contents[0]) {
        throw new NotFoundException(
          `좋아요를 누른 ${contentsRequestDto.filter} 게시물이 없습니다`,
        );
      }

      return contents;
    }

    const contents = await this.contentsRepository.getLikedContents(user);

    if (!contents[0]) {
      throw new NotFoundException(`좋아요를 누른 게시물이 없습니다`);
    }

    return contents;
  }

  async recommendContents(user: number) {
    const categories = await this.contentsRepository.getUserTags(user);
    const categoryNames = await this.contentsRepository.findCategoryName(
      categories,
    );

    const category = {};

    categoryNames.forEach((categoryName) => {
      if (category[categoryName]) {
        category[categoryName] += 1;
      } else {
        category[categoryName] = 1;
      }
    });

    const categoryCnt = Object.keys(category).length;

    if (categoryCnt == 1) {
      category[Object.keys(category)[0]] = 3;
    } else if (categoryCnt == 2) {
      const values = Object.values(category);
      if (values[0] == values[1]) {
        const randomIdx = parseInt((Math.random() > 0.5).toString());
        category[Object.keys(category)[randomIdx]] = 2;
      }
    }

    const contents = await this.contentsRepository.recommendContents(category);

    return contents;
  }

  async getContentDetail(
    user: number,
    pk: number,
  ): Promise<ContentsDetailResponseDto> {
    const content = await this.contentsRepository.getContentDetail(user, pk);

    return content;
  }

  async likeContent(user: number, content: number): Promise<LikeResponseDTO> {
    const liked = await this.contentsRepository.isLiked(user, content);

    if (!liked) {
      const like = await this.contentsRepository.likeContent(user, content);
      return like;
    }

    throw new BadRequestException('already liked');
  }

  async unlikeContent(user: number, content: number[]): Promise<void> {
    return await this.contentsRepository.unlikeContent(user, content);
  }
}
