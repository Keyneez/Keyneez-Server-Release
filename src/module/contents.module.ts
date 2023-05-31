import { Module } from '@nestjs/common';
import { ContentsController } from 'src/domain/contents.controller';
import { ContentsService } from 'src/service/contents.service';

@Module({
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}
