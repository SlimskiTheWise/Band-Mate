import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PaginateOptionsDto } from './dtos/paginate.options.dto';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { PageDto, PageMetaDto } from './responses/page.dto';

type PaginateResult<T> = Promise<PageDto<T>>;
@Injectable()
export class UtilsService {
  constructor(private configService: ConfigService) {}

  async encrypt(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt(
      Number(this.configService.get<number>('bcrypt.salt')),
    );
    return await bcrypt.hash(plainText, salt);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async paginate<T>(
    query: PaginateOptionsDto,
    repository: Repository<ObjectLiteral>,
  ): PaginateResult<T> {
    const [items, total] = await repository.findAndCount({
      ...query,
      skip: query.take * (query.page - 1),
    });

    const pageMeta = new PageMetaDto({
      page: query.page,
      take: query.take,
      total,
    });

    return new PageDto<T>(items as T[], pageMeta);
  }

  async queryBuilderPaginate<T>(
    queryBuilder: SelectQueryBuilder<ObjectLiteral>,
    query: PaginateOptionsDto,
  ): PaginateResult<T> {
    queryBuilder.take(query.take).skip((query.page - 1) * query.take);

    const [items, total] = await queryBuilder.getManyAndCount();

    const pageMeta = new PageMetaDto({
      page: query.page,
      take: query.take,
      total,
    });

    return new PageDto<T>(items as T[], pageMeta);
  }
}
