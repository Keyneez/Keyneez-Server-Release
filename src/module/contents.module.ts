import { Module } from '@nestjs/common';
import { ContentsController } from 'src/domain/contents/contents.controller';
import { ContentsRepository } from 'src/repository/contents/contents.repository';
import { ContentsService } from 'src/service/contents/contents.service';

@Module({
  controllers: [ContentsController],
  providers: [ContentsService, ContentsRepository],
})
export class ContentsModule {}
