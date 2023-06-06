import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import {
  AccessTokenGuard,
  JwtAuthUser,
} from 'src/domain/auth/guard/access-token.guard';
import { User } from 'src/global/decorators/jwt.decorator';
import { UserService } from '../service/user.service';
import { ResponseDto } from 'src/global/dtos/response.dto';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getUserInfo(@User() user: JwtAuthUser) {
    const result = await this.userService.getUserInfo(user.userPk);
    return ResponseDto.okWithData(HttpStatus.OK, '유저 조회 성공', result);
  }
}
