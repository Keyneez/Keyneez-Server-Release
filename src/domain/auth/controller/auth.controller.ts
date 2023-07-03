import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from '../guard/refresh-token.guard';
import { JwtAuthUser, User } from 'src/global/decorators/jwt.decorator';
import { AuthService } from '../service/auth.service';
import { RefreshRequestDto } from '../dtos/refresh-request.dto';
import { ResponseDto } from 'src/global/dtos/response.dto';
import { AccessTokenGuard } from '../guard/access-token.guard';
import { LogOutDocs, RefreshDocs } from 'docs/auth/auth.swagger';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/refresh')
  @UseGuards(RefreshTokenGuard)
  @RefreshDocs()
  async refresh(@User() user: JwtAuthUser, @Body() dto: RefreshRequestDto) {
    const result = await this.authService.refresh(
      user.userPk,
      dto.refresh_token,
    );
    return ResponseDto.okWithData(HttpStatus.OK, '재발급 성공', result);
  }

  @Get('/logout')
  @UseGuards(AccessTokenGuard)
  @LogOutDocs()
  async logout(@User() user: JwtAuthUser) {
    await this.authService.logout(user.userPk);
    return ResponseDto.ok(HttpStatus.OK, '로그아웃 성공');
  }

  @Delete('/withdraw')
  @UseGuards(AccessTokenGuard)
  async withdraw(@User() user: JwtAuthUser) {
    await this.authService.withdraw(user.userPk);
    return ResponseDto.ok(HttpStatus.OK, '회원탈퇴 성공');
  }
}
