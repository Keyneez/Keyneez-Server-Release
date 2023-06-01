import { ContentsRequestDto } from './../dto/contents/contents-request.dto';
import { ContentsResponseDto } from './../dto/contents/contents-response.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentsService } from 'src/service/contents.service';
import {
  GetContentDetailDocs,
  GetContentsDocs,
  SearchByKeywordDocs,
} from 'docs/contents/contents.swagger';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get('')
  @GetContentsDocs()
  async getContents(
    @Query() contentsRequestDto: ContentsRequestDto,
  ): Promise<ContentsResponseDto[]> {
    return this.contentsService.getContents(contentsRequestDto);
  }

  @Get('/search')
  @SearchByKeywordDocs()
  async searchByKeyword(
    @Query('keyword') keyword: string,
  ): Promise<ContentsResponseDto[]> {
    return this.contentsService.searchByKeyword(keyword);
  }

  @Get('/:id')
  @GetContentDetailDocs()
  async getContentDetail(
    @Param('id') id: number,
  ): Promise<ContentsResponseDto> {
    return this.contentsService.getContentDetail(+id);
  }
}
