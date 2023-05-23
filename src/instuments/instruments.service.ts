import { Instruments } from './instruments.entity';
import { Injectable } from '@nestjs/common';
import { CreateInstrumentDto } from './dtos/create-instument.dto';
import { Users } from 'src/users/users.entity';
import { InstrumentsRepository as InstrumentsRepository } from './instruments.repository';
import { PageDto } from '../utils/responses/page.dto';
import { PaginateOptionsDto } from 'src/utils/dtos/paginate.options.dto';

@Injectable()
export class InstrumentsService {
  constructor(private instrumentsRepository: InstrumentsRepository) {}

  async createInstrument(
    body: CreateInstrumentDto,
    user: Users,
  ): Promise<Instruments> {
    return this.instrumentsRepository.createInstrument(body, user.id);
  }

  async getInsturments(
    query: PaginateOptionsDto,
  ): Promise<PageDto<Instruments>> {
    return this.instrumentsRepository.getInstruments(query);
  }
}
