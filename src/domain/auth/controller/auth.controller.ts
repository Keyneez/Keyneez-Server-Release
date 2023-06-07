import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from '../guard/refresh-token.guard';
import { JwtAuthUser, User } from 'src/global/decorators/jwt.decorator';
import { AuthService } from '../service/auth.service';
import { RefreshRequestDto } from '../dto/refresh-request.dto';
import { ResponseDto } from 'src/global/dtos/response.dto';
import { AccessTokenGuard } from '../guard/access-token.guard';
import { LogOutDocs, RefreshDocs } from 'docs/auth/auth.swagger';

@Controller('/api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/auth/refresh')
  @UseGuards(RefreshTokenGuard)
  @RefreshDocs()
  async refresh(@User() user: JwtAuthUser, @Body() dto: RefreshRequestDto) {
    const result = await this.authService.refresh(
      user.userPk,
      dto.refresh_token,
    );
    return ResponseDto.okWithData(HttpStatus.OK, '재발급 성공', result);
  }

  @Get('/auth/logout')
  @UseGuards(AccessTokenGuard)
  @LogOutDocs()
  async logout(@User() user: JwtAuthUser) {
    await this.authService.logout(user.userPk);
    return ResponseDto.ok(HttpStatus.OK, '로그아웃 성공');
  }
}
