import { ContentsModule } from './domain/contents/contents.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './global/middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import appConfig from './global/configs/app.config';
import databaseConfig from './global/configs/database.config';
import { PrismaModule } from './global/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
      isGlobal: true,
    }),
    PrismaModule,
    ContentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
