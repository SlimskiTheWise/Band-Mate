import { Instruments } from './instruments.entity';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateInstrumentDto } from './dtos/create-instument.dto';
import { Users } from 'src/users/users.entity';
import { InstrumentsRepository as InstrumentsRepository } from './instruments.repository';
import { PageDto } from '../utils/responses/page.dto';
import { InstrumentsFindAllDto } from './dtos/instruments-find-all.dto';

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
    query: InstrumentsFindAllDto,
  ): Promise<PageDto<Instruments>> {
    return this.instrumentsRepository.getInstruments(query);
  }

  async getInstrumentById(instrumentId: number): Promise<Instruments> {
    return this.instrumentsRepository.getInstrumentById(instrumentId);
  }

  async deleteInstrument(user: Users, instrumentId: number): Promise<void> {
    const instrument = await this.instrumentsRepository.getInstrumentById(
      instrumentId,
    );

    if (!instrument) {
      throw new NotFoundException('comment not found');
    }

    if (user.id !== instrument.userId) {
      throw new UnauthorizedException();
    }

    return this.instrumentsRepository.deleteInstrument(instrumentId);
  }
}
