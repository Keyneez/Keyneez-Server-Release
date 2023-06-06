import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './global/middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import appConfig from './global/configs/app.config';
import databaseConfig from './global/configs/database.config';
import { PrismaModule } from './global/prisma/prisma.module';
import { AuthModule } from './domain/auth/auth.module';
import jwtConfig from './global/configs/jwt.config';
import oauthConfig from './global/configs/oauth.config';
import { UserModule } from './domain/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, jwtConfig, oauthConfig],
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
