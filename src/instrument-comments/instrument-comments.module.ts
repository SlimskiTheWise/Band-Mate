import { Module } from '@nestjs/common';
import { InstrumentCommentsController } from './instrument-comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentComments } from './instrument-comments.entity';
import { InstrumentCommentsService } from './instrument-comments.service';
import { InstrumentCommentsRepository } from './instrument-comments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InstrumentComments])],
  providers: [InstrumentCommentsService, InstrumentCommentsRepository],
  controllers: [InstrumentCommentsController],
})
export class InstrumentCommentsModule {}
