import { Module } from '@nestjs/common';
import { TagController } from './controller/tag.controller';
import { TagService } from './service/tag.service';
import { TagRepository } from './repository/tag.repository';

@Module({
  controllers: [TagController],
  providers: [TagService, TagRepository],
})
export class TagModule {}
