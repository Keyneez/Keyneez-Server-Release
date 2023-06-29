import { LikeResponseDTO } from '../dtos/like-response.dto';
import { GetContentsRequestDto } from '../dtos/contents-request.dto';
import { ContentsDetailResponseDto } from '../dtos/contents-detail-response.dto';
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { ContentsService } from 'src/domain/contents/service/contents.service';
import {
  GetContentDetailDocs,
  GetContentsDocs,
  GetLikedContentsDocs,
  LikeContentDocs,
  SearchByKeywordDocs,
  UnLikeContentDocs,
} from 'docs/contents/contents.swagger';
import { ContentsResponseDto } from '../dtos/contents-response.dto';
import { AccessTokenGuard } from 'src/domain/auth/guard/access-token.guard';
import { JwtAuthUser, User } from 'src/global/decorators/jwt.decorator';
import { ContentsLikedResponseDto } from '../dtos/contents-liked-response.dto';
import { ResponseDto } from '../../../global/dtos/response.dto';

@Controller('api/contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get('')
  @UseGuards(AccessTokenGuard)
  @GetContentsDocs()
  async getContents(
    @User() user: JwtAuthUser,
    @Query() contentsRequestDto: GetContentsRequestDto,
  ): Promise<ResponseDto<ContentsResponseDto[]>> {
    const result = await this.contentsService.getContents(
      user.userPk,
      contentsRequestDto,
    );
    return ResponseDto.okWithData(HttpStatus.OK, '콘텐츠 조회 성공', result);
  }

  @Get('/search')
  @UseGuards(AccessTokenGuard)
  @SearchByKeywordDocs()
  async searchByKeyword(
    @User() user: JwtAuthUser,
    @Query('keyword') keyword: string,
  ): Promise<ResponseDto<ContentsResponseDto[]>> {
    const result = await this.contentsService.searchByKeyword(
      user.userPk,
      keyword,
    );
    return ResponseDto.okWithData(HttpStatus.OK, '콘텐츠 검색 성공', result);
  }

  @Get('/liked')
  @UseGuards(AccessTokenGuard)
  @GetLikedContentsDocs()
  async getLikedContent(
    @User() user: JwtAuthUser,
    @Query() contentsRequestDto: GetContentsRequestDto,
  ): Promise<ResponseDto<ContentsLikedResponseDto[]>> {
    const reuslt = await this.contentsService.getLikedContents(
      user.userPk,
      contentsRequestDto,
    );
    return ResponseDto.okWithData(
      HttpStatus.OK,
      '좋아요 콘텐츠 조회 성공',
      reuslt,
    );
  }

  @Get('/:pk')
  @UseGuards(AccessTokenGuard)
  @GetContentDetailDocs()
  async getContentDetail(
    @User() user: JwtAuthUser,
    @Param('pk') pk: number,
  ): Promise<ResponseDto<ContentsDetailResponseDto>> {
    const result = await this.contentsService.getContentDetail(
      user.userPk,
      +pk,
    );
    return ResponseDto.okWithData(HttpStatus.OK, '상세 조회 성공', result);
  }

  @Post('/:pk/like')
  @UseGuards(AccessTokenGuard)
  @LikeContentDocs()
  async likeContent(
    @User() user: JwtAuthUser,
    @Param('pk') pk: number,
  ): Promise<ResponseDto<LikeResponseDTO>> {
    const result = await this.contentsService.likeContent(user.userPk, +pk);
    return ResponseDto.okWithData(HttpStatus.OK, '좋아요 성공', result);
  }

  @Post('/:pk/unlike')
  @UseGuards(AccessTokenGuard)
  @UnLikeContentDocs()
  async unikeContent(
    @User() user: JwtAuthUser,
    @Param('pk') pk: string,
  ): Promise<ResponseDto<[]>> {
    //! number type에 대한 검증 필요
    //! validation 시 복잡하면 BODY로 넘기기
    const contents = pk.split(',').map(Number);

    await this.contentsService.unlikeContent(user.userPk, contents);
    return ResponseDto.ok(HttpStatus.OK, '좋아요 취소 성공');
  }
}
