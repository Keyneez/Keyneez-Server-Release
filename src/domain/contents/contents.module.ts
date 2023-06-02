import { Module } from '@nestjs/common';
import { ContentsController } from 'src/domain/contents/controller/contents.controller';
import { ContentsRepository } from 'src/domain/contents/repository/contents/contents.repository';
import { ContentsService } from 'src/domain/contents/service/contents/contents.service';

@Module({
  controllers: [ContentsController],
  providers: [ContentsService, ContentsRepository],
})
export class ContentsModule {}
