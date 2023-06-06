import { Module } from '@nestjs/common';
import { OAuthController } from './controller/oauth.controller';
import { OAuthService } from './service/oauth.service';
import { JwtUtils } from './jwt/jwt.utils';
import { SnsProvider } from './service/sns.provider';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { UserRepository } from '../user/repository/user.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [HttpModule, CacheModule.register(), JwtModule.register({})],
  controllers: [OAuthController],
  providers: [OAuthService, JwtUtils, SnsProvider, UserRepository],
})
export class AuthModule {}
