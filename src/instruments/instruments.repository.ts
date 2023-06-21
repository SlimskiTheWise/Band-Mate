import { UtilsService } from 'src/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Instruments as Instruments } from './instruments.entity';
import { CreateInstrumentDto } from './dtos/create-instument.dto';
import { PageDto } from 'src/utils/responses/page.dto';
import { InstrumentComments } from 'src/instrument-comments/instrument-comments.entity';
import { InstrumentsFindAllDto } from './dtos/instruments-find-all.dto';

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
    query: InstrumentsFindAllDto,
  ): Promise<PageDto<Instruments>> {
    const { take, page, minimumPrice, maximumPrice, ...options } = query;

    const queryBuilder = this.instrumentsRepository
      .createQueryBuilder('instruments')
      .leftJoin('instruments.user', 'users')
      .addSelect(['users.username'])
      .where('instruments.price >= :minimumPrice', { minimumPrice })
      .andWhere('instruments.price <= :maximumPrice', { maximumPrice });

    if (Object.keys(options).length !== 0) {
      const [[key, value]] = Object.entries(options);
      const table = key === 'username' ? 'users' : 'instruments';

      queryBuilder.andWhere(`${table}.${key} LIKE :${key}`, {
        [key]: `%${value}%`,
      });
    }

    return this.utilsService.queryBuilderPaginate(queryBuilder, { take, page });
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
