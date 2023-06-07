import { Global, Module } from '@nestjs/common';
import { OAuthController } from './controller/oauth.controller';
import { OAuthService } from './service/oauth.service';
import { TokenService } from './service/token.service';
import { SnsProvider } from './service/sns.provider';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { UserRepository } from '../user/repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './guard/access-token.guard';

@Global()
@Module({
  imports: [HttpModule, CacheModule.register(), JwtModule.register({})],
  controllers: [OAuthController],
  providers: [
    OAuthService,
    TokenService,
    SnsProvider,
    UserRepository,
    AccessTokenGuard,
  ],
  exports: [TokenService],
})
export class AuthModule {}
