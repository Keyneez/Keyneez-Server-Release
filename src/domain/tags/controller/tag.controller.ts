import { Controller, Get, HttpStatus } from '@nestjs/common';
import { TagService } from '../service/tag.service';
import { GetAllTagDocs } from '../../../../docs/tag/tag.swagger';
import { ResponseDto } from '../../../global/dtos/response.dto';

@Controller('/api/tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get('')
  @GetAllTagDocs()
  public async getTagAll() {
    const reuslt = await this.tagService.getTags();
    return ResponseDto.okWithData(HttpStatus.OK, '태그 조회 성공', reuslt);
  }
}
