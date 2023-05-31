import { ContentsRequestDto } from './../dto/contents/contents-request.dto';
import { ContentsResponseDto } from './../dto/contents/contents-response.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentsService } from 'src/service/contents.service';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}
  @Get('')
  async getContents(@Query() contentsRequestDto: ContentsRequestDto) {
    return this.contentsService.getContents(contentsRequestDto);
  }

  //   @Get('search/:keyword')
  //   async searchByKeyword(@Param('keyword') keyword: string) {
  //     return this.contentsService.searchByKeyword(keyword);
  //   }
}
