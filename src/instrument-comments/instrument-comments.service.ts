import { InstrumentCommentsRepository } from './instrument-comments.repository';
import { Injectable } from '@nestjs/common';
import { CreateInstrumentComment } from './interfaces/create-intrument-comment.interface';

@Injectable()
export class InstrumentCommentsService {
  constructor(
    private readonly instrumentCommentsRepository: InstrumentCommentsRepository,
  ) {}

  async createInstrumentComment(
    comment: CreateInstrumentComment,
  ): Promise<void> {
    await this.instrumentCommentsRepository.createInstrumentComment(comment);
  }
}
