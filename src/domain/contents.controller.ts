import { ResponseDto } from './../global/dtos/response.dto';
import { ContentsRequestDto } from './../dto/contents/contents-request.dto';
import { ContentsResponseDto } from './../dto/contents/contents-response.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentsService } from 'src/service/contents.service';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}
  @Get('')
  async getContents(
    @Query() contentsRequestDto: ContentsRequestDto,
  ): Promise<ContentsResponseDto[]> {
    return this.contentsService.getContents(contentsRequestDto);
  }

  @Get('/:id')
  async getContentDetail(
    @Param('id') id: number,
  ): Promise<ContentsResponseDto> {
    return this.contentsService.getContentDetail(+id);
  }

  @Get('search')
  async searchByKeyword(@Query('keyword') keyword: string) {
    return this.contentsService.searchByKeyword(keyword);
  }
}
