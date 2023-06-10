import { GetContentsRequestDto } from '../dtos/contents-request.dto';
import { ContentsResponseDto } from '../dtos/contents-response.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentsService } from 'src/domain/contents/service/contents.service';
import {
  GetContentDetailDocs,
  GetContentsDocs,
  SearchByKeywordDocs,
} from 'docs/contents/contents.swagger';

@Controller('api/contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get('')
  @GetContentsDocs()
  async getContents(
    @Query() contentsRequestDto: GetContentsRequestDto,
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

  @Get('/:pk')
  @GetContentDetailDocs()
  async getContentDetail(
    @Param('pk') pk: number,
  ): Promise<ContentsResponseDto> {
    return this.contentsService.getContentDetail(+pk);
  }
}
