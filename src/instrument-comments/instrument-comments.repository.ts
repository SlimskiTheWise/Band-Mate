import { InjectRepository } from '@nestjs/typeorm';
import { InstrumentComments } from './instrument-comments.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class InstrumentCommentsRepository {
  constructor(
    @InjectRepository(InstrumentComments)
    private instrumentCommentsRepository: Repository<InstrumentComments>,
  ) {}
}
