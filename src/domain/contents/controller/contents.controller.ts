import { ContentsLikeResponseDTO } from './../dtos/contents-like-response.dto';
import { GetContentsRequestDto } from '../dtos/contents-request.dto';
import { ContentsDetailResponseDto } from '../dtos/contents-detail-response.dto';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ContentsService } from 'src/domain/contents/service/contents.service';
import {
  GetContentDetailDocs,
  GetContentsDocs,
  LikeContentDocs,
  SearchByKeywordDocs,
} from 'docs/contents/contents.swagger';
import { ContentsResponseDto } from '../dtos/contents-response.dto';
import { AccessTokenGuard } from 'src/domain/auth/guard/access-token.guard';
import { JwtAuthUser, User } from 'src/global/decorators/jwt.decorator';

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
  ): Promise<ContentsDetailResponseDto> {
    return this.contentsService.getContentDetail(+pk);
  }

  @Get('/:pk/like')
  @UseGuards(AccessTokenGuard)
  @LikeContentDocs()
  async likeContent(
    @User() user: JwtAuthUser,
    @Param('pk') pk: number,
  ): Promise<ContentsLikeResponseDTO> {
    return this.contentsService.likeContent(user.userPk, +pk);
  }
}
