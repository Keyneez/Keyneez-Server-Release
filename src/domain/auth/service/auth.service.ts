import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repository/user.repository';
import { TokenService } from './token.service';
import { Users } from '@prisma/client';
import { RefreshResponseDto } from '../dto/refresh-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService,
  ) {}

  async refresh(
    userPk: number,
    refreshToken: string,
  ): Promise<RefreshResponseDto> {
    const user = await this.userRepository.findByPk(userPk);
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    if (!this.isEqualRefreshToken(user, refreshToken)) {
      throw new ConflictException('잘못된 refresh token입니다.');
    }

    await this.tokenService.verifyRefreshToken(refreshToken);

    const newAccessToken = await this.tokenService.generateAccessToken(user);

    return new RefreshResponseDto(newAccessToken);
  }

  private isEqualRefreshToken(user: Users, inputRefreshToken: string): boolean {
    return user.refresh_token == inputRefreshToken;
  }
}
