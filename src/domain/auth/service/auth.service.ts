import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repository/user.repository';
import { TokenService } from './token.service';
import { Users } from '@prisma/client';
import { RefreshResponseDto } from '../dtos/refresh-response.dto';
import { SnsService } from './sns.service';
import { PrismaService } from '../../../global/prisma/prima.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService,
    private snsService: SnsService,
    private prisma: PrismaService,
  ) {}
  private readonly logger = new Logger(AuthService.name);
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

  async logout(userPk: number) {
    const user = await this.userRepository.findByPk(userPk);
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }
    await this.userRepository.updateRefreshToken(userPk, null);
  }

  async withdraw(userPk: number) {
    const user = await this.userRepository.findByPk(userPk);
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    // 애플 로그인 구현 이후 리팩토링 하겠습니다
    // EX-> if문을 트래작션 안에서 처리..
    if (user.sns_type == 'KAKAO') {
      await this.kakaoWithDraw(user);
    }
  }

  private async kakaoWithDraw(user: Users) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await this.userRepository.delete(tx, user.user_pk);
        await this.snsService.unlinkKakao(user.sns_id);
      });
    } catch (err) {
      // 나중에 로깅이 추가되면 들어가면 수정하겠습니다
      this.logger.error(err);
      if (err.name == 'AxiosError') {
        this.logger.error('카카오 서버 unlink 요청 에러');
      }
      throw new InternalServerErrorException('회원 탈퇴 실패');
    }
  }

  private isEqualRefreshToken(user: Users, inputRefreshToken: string): boolean {
    return user.refresh_token == inputRefreshToken;
  }
}
