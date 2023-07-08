import { ContentsRepository } from '../repository/contents.repository';
import { GetContentsRequestDto } from '../dtos/contents-request.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { LikeResponseDTO } from '../dtos/like-response.dto';
import { ContentsLikedResponseDto } from '../dtos/contents-liked-response.dto';
import { ContentsDetailResponseDto } from '../dtos/contents-detail-response.dto';

@Injectable()
export class ContentsService {
  constructor(private readonly contentsRepository: ContentsRepository) {}

  async getContents(user: number, contentsRequestDto: GetContentsRequestDto) {
    if (contentsRequestDto.filter) {
      const contents = await this.contentsRepository.getFilteredContents(
        user,
        contentsRequestDto.filter,
      );
      const result = contents.map((content) => {
        const { ContentCategories, Likes, Tags, ...pureContent } = content;
        return new ContentsDetailResponseDto(pureContent, content);
      });

      return result;
    }
    const contents = await this.contentsRepository.getAllContents(user);

    const result = contents.map((content) => {
      const { ContentCategories, Likes, Tags, ...pureContent } = content;
      return new ContentsDetailResponseDto(pureContent, content);
    });
    return result;
  }

  async searchByKeyword(
    user: number,
    keyword: string,
  ): Promise<ContentsDetailResponseDto[]> {
    const contents = await this.contentsRepository.searchByKeyword(
      user,
      keyword,
    );
    if (!contents[0]) {
      throw new NotFoundException(
        'Not found contents including keyword: ' + keyword,
      );
    }

    const result = contents.map((content) => {
      const { ContentCategories, Likes, Tags, ...pureContent } = content;
      return new ContentsDetailResponseDto(pureContent, content);
    });

    return result;
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

      const result = contents.map((content) => {
        const { ContentCategories, Tags, ...pureContent } = content;
        return new ContentsLikedResponseDto(pureContent, content);
      });

      return result;
    }

    const contents = await this.contentsRepository.getLikedContents(user);

    if (!contents[0]) {
      throw new NotFoundException(`좋아요를 누른 게시물이 없습니다`);
    }

    const result = contents.map((content) => {
      const { ContentCategories, Tags, ...pureContent } = content;
      return new ContentsLikedResponseDto(pureContent, content);
    });

    return result;
  }

  private categoryCount(categoryNames: string[]) {
    const category = {};

    //* 각 카테고리의 개수를 세어 객체 형태로 저장
    categoryNames.forEach((categoryName) => {
      if (category[categoryName]) {
        category[categoryName] += 1;
      } else {
        category[categoryName] = 1;
      }
    });

    //* 카테고리의 종류 개수
    const categoryCnt = Object.keys(category).length;

    //* 기획 알고리즘에 맞추어 category 객체를 '카테고리':가져와야할 게시물의 수 로 조정
    if (categoryCnt == 1) {
      category[Object.keys(category)[0]] = 3;
    } else if (categoryCnt == 2) {
      const values = Object.values(category);
      if (values[0] == values[1]) {
        const randomIdx = Math.random() < 0.5 ? 0 : 1;
        category[Object.keys(category)[randomIdx]] = 2;
      }
    }

    return category;
  }

  async recommendContents(user: number): Promise<ContentsDetailResponseDto[]> {
    const categoryNames = await this.contentsRepository.getUserTags(user);
    const category = this.categoryCount(categoryNames);

    //* 가져와야할 게시물의 개수대로 랜덤하게 (카테고리별 최근 3개의 게시물 중에) 가져오기
    const contents = await this.contentsRepository.recommendContents(category);

    const temp_result = [];

    //* 이중 리스트 구조 -> 단일 리스트로 변환
    for (const sublist of contents) {
      for (const obj of sublist) {
        temp_result.push(obj);
      }
    }

    const result = temp_result.map((content) => {
      const { ContentCategories, Likes, Tags, ...pureContent } = content;
      return new ContentsDetailResponseDto(pureContent, content);
    });

    return result;
  }

  async getContentDetail(
    user: number,
    pk: number,
  ): Promise<ContentsDetailResponseDto> {
    const content = await this.contentsRepository.getContentDetail(user, pk);
    const { ContentCategories, Likes, Tags, ...pureContent } = content;

    return new ContentsDetailResponseDto(pureContent, content);
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
