import { Injectable } from '@nestjs/common';
import { TagRepository } from '../repository/tag.repository';
import { TagResponseDto } from '../dto/tag.response.dto';

@Injectable()
export class TagService {
  constructor(private tagRepository: TagRepository) {}

  async getTags(): Promise<TagResponseDto[]> {
    const result = await this.tagRepository.findAllWithCategory();
    return result.map((tag) => new TagResponseDto(tag));
  }
}
