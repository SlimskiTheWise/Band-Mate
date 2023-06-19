import { UtilsService } from 'src/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Instruments as Instruments } from './instruments.entity';
import { CreateInstrumentDto } from './dtos/create-instument.dto';
import { PageDto } from 'src/utils/responses/page.dto';
import { PaginateOptionsDto } from 'src/utils/dtos/paginate.options.dto';
import { InstrumentComments } from 'src/instrument-comments/instrument-comments.entity';

@Injectable()
export class InstrumentsRepository {
  constructor(
    @InjectRepository(Instruments)
    private instrumentsRepository: Repository<Instruments>,
    private utilsService: UtilsService,
    private dataSource: DataSource,
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

  async getInstrumentById(instrumentId: number): Promise<Instruments> {
    return this.instrumentsRepository
      .createQueryBuilder('instruments')
      .leftJoinAndSelect('instruments.instrumentComments', 'instrumentComments')
      .leftJoin('instrumentComments.user', 'user')
      .addSelect(['user.id', 'user.username'])
      .where('instruments.id = :instrumentId', { instrumentId })
      .getOne();
  }

  async deleteInstrument(instrumentId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.softDelete(Instruments, { id: instrumentId });
      await queryRunner.manager.softDelete(InstrumentComments, {
        instrumentId,
      });
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
