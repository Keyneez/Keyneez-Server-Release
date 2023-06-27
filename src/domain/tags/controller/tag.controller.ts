import { Controller, Get } from '@nestjs/common';
import { TagService } from '../service/tag.service';
import { GetAllTagDocs } from '../../../../docs/tag/tag.swagger';

@Controller('/api/tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get('')
  @GetAllTagDocs()
  public async getTagAll() {
    return await this.tagService.getTags();
  }
}
