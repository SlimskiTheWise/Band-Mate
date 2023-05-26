import { UtilsService } from 'src/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instruments as Instruments } from './instruments.entity';
import { CreateInstrumentDto } from './dtos/create-instument.dto';
import { PageDto } from 'src/utils/responses/page.dto';
import { PaginateOptionsDto } from 'src/utils/dtos/paginate.options.dto';

@Injectable()
export class InstrumentsRepository {
  constructor(
    @InjectRepository(Instruments)
    private instrumentsRepository: Repository<Instruments>,
    private utilsService: UtilsService,
  ) {}

  async createInstrument(
    body: CreateInstrumentDto,
    userId: number,
  ): Promise<Instruments> {
    return this.instrumentsRepository.save({
      userId,
      ...body,
    });
  }

  async getInstruments(
    query: PaginateOptionsDto,
  ): Promise<PageDto<Instruments>> {
    const queryBuilder = this.instrumentsRepository
      .createQueryBuilder('instruments')
      .leftJoin('instruments.user', 'users')
      .addSelect(['users.email']);

    return this.utilsService.queryBuilderPaginate(queryBuilder, query);
  }
}
