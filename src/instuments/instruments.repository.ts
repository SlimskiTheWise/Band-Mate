import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instruments as Instruments } from './instruments.entity';
import { CreateInstrumentDto } from './dtos/create-instument.dto';

@Injectable()
export class InstrumentsRepository {
  constructor(
    @InjectRepository(Instruments)
    private instrumentsRepository: Repository<Instruments>,
  ) {}

  async createInstrument(
    body: CreateInstrumentDto,
    userId: number,
  ): Promise<Instruments> {
    return this.instrumentsRepository.save({
      userId,
      body,
    });
  }
}
