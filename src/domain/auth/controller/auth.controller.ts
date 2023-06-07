import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '../guard/refresh-token.guard';
import { JwtAuthUser, User } from 'src/global/decorators/jwt.decorator';
import { AuthService } from '../service/auth.service';
import { RefreshRequestDto } from '../dto/refresh-request.dto';
import { ResponseDto } from 'src/global/dtos/response.dto';

@Controller('/api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/auth/refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@User() user: JwtAuthUser, @Body() dto: RefreshRequestDto) {
    const result = await this.authService.refresh(
      user.userPk,
      dto.refreshToken,
    );
    return ResponseDto.okWithData(HttpStatus.OK, '재발급 성공', result);
  }
}
