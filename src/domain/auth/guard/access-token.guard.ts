import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { TokenService } from '../service/token.service';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) {
      throw new BadRequestException('token이 필요합니다.');
    }

    const payload = await this.tokenService.verifyAccessToken(accessToken);
    request['user'] = {
      userPk: Number.parseInt(payload.sub),
    };
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
