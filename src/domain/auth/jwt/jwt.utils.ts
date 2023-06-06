import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { TokenExpiredError } from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import jwtConfig from 'src/global/configs/jwt.config';

export interface Token {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class JwtUtils {
  constructor(
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY) private config: ConfigType<typeof jwtConfig>,
  ) {}

  async idTokenVerify(
    token: string,
    audience: string,
    issuer: string,
    publicKey: any,
  ): Promise<any> {
    const pem = jwkToPem(publicKey);
    try {
      const decodedPayload = await this.jwtService.verifyAsync(token, {
        publicKey: pem,
        audience,
        issuer,
      });
      return decodedPayload;
    } catch (e) {
      console.error(e);
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('만료된 token');
      }
      throw new BadRequestException('token 에러');
    }
  }

  getKidFromIdToken(token: string) {
    const result = this.jwtService.decode(token, {
      complete: true,
      json: true,
    });
    if (result['header'].kid == undefined) {
      throw new BadRequestException('invalid tokens!!');
    }
    return result['header'].kid;
  }

  async generateToken(user: Users): Promise<Token> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken();
    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.config.accessTokenSecret,
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('만료된 token');
      }
      throw new BadRequestException('token 에러');
    }
  }

  async verifyRefreshToken(refreshToken: string) {}

  async verifyAccessTokenNotExpireCheck() {}

  async generateAccessToken(user: Users) {
    const payload = {
      iss: 'Keenze',
      sub: user.user_pk.toString(),
    };
    return await this.jwtService.signAsync(payload, {
      secret: this.config.accessTokenSecret,
      expiresIn: this.config.accessTokenExpired,
    });
  }

  async generateRefreshToken() {
    return await this.jwtService.signAsync(
      {},
      {
        secret: this.config.refreshTokenSecret,
        expiresIn: this.config.refreshTokenExpired,
        issuer: 'Keenez',
      },
    );
  }
}
