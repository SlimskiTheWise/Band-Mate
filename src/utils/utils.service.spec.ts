import { UtilsService } from 'src/utils/utils.service';
import { Test, TestingModule } from '@nestjs/testing';
import { REPOSITORY_TOKEN } from 'src/test/repository-token';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginateOptionsDto } from './dtos/paginate.options.dto';
import { PageDto } from './responses/page.dto';
import { seedManyUsers } from 'src/test/mock-data/user-mock-data';
import { Users } from 'src/users/users.entity';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

const mockItems = seedManyUsers();

const query: PaginateOptionsDto = {
  page: 1,
  take: 10,
};

describe('UtilService', () => {
  let utilService: UtilsService;
  let repository: Repository<Users>;
  let queryBuilder: SelectQueryBuilder<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [
        UtilsService,
        {
          provide: REPOSITORY_TOKEN.USERS,
          useValue: { findAndCount: jest.fn() },
        },
        {
          provide: SelectQueryBuilder,
          useValue: {
            take: jest.fn(),
            skip: jest.fn(),
            getManyAndCount: jest.fn(),
          },
        },
      ],
    }).compile();

    utilService = module.get<UtilsService>(UtilsService);
    repository = module.get<Repository<Users>>(REPOSITORY_TOKEN.USERS);
    queryBuilder = module.get<SelectQueryBuilder<any>>(SelectQueryBuilder);
  });

  it('should paginate the items and return a PageDto', async () => {
    jest
      .spyOn(repository, 'findAndCount')
      .mockResolvedValue([mockItems.slice(0, 10), 100]);

    const result = await utilService.paginate(query, repository);

    expect(repository.findAndCount).toHaveBeenCalledWith({
      ...query,
      skip: query.take * (query.page - 1),
    });
    expect(result).toBeInstanceOf(PageDto);
    expect(result.items.length).toBe(10);
    expect(result.meta).toEqual({ page: 1, take: 10, total: 100 });
  });

  it('should paginate the items and return a PageDto using queryBuilder', async () => {
    jest.spyOn(queryBuilder, 'take').mockReturnThis();
    jest.spyOn(queryBuilder, 'skip').mockReturnThis();
    jest
      .spyOn(queryBuilder, 'getManyAndCount')
      .mockResolvedValue([[...mockItems.slice(0, 10)], 100]);

    const result = await utilService.queryBuilderPaginate(queryBuilder, query);

    expect(queryBuilder.take).toHaveBeenCalledWith(query.take);
    expect(queryBuilder.skip).toHaveBeenCalledWith(
      (query.page - 1) * query.take,
    );
    expect(queryBuilder.getManyAndCount).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(PageDto);
    expect(result.items.length).toBe(10);
    expect(result.meta.page).toBe(query.page);
    expect(result.meta.take).toBe(query.take);
  });
});
