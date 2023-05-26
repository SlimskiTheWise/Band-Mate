import { InjectRepository } from '@nestjs/typeorm';
import { InstrumentComments } from './instrument-comments.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateInstrumentComment } from './interfaces/create-intrument-comment.interface';

@Injectable()
export class InstrumentCommentsRepository {
  constructor(
    @InjectRepository(InstrumentComments)
    private instrumentCommentsRepository: Repository<InstrumentComments>,
  ) {}

  async createInstrumentComment(
    comment: CreateInstrumentComment,
  ): Promise<void> {
    await this.instrumentCommentsRepository.save(comment);
  }
}
