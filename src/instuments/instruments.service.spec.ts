import { UtilsService } from 'src/utils/utils.service';
import { InstrumentsRepository } from './instruments.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentsService } from './instruments.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { REPOSITORY_TOKEN } from 'src/test/repository-token';
import { seedSingleUser } from 'src/test/mock-data/user-mock-data';
import {
  seedManyInstruments,
  seedSingleInstrument,
} from 'src/test/mock-data/instrument-mock.data';
import { CreateInstrumentDto } from './dtos/create-instument.dto';
import { PageDto } from 'src/utils/responses/page.dto';
import { Instruments } from './instruments.entity';
import { PaginateOptionsDto } from 'src/utils/dtos/paginate.options.dto';

describe('InstrumentsService', () => {
  let instrumentsService: InstrumentsService;
  let instrumentRepository: InstrumentsRepository;
  let utilsService: UtilsService;

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
        InstrumentsService,
        {
          provide: REPOSITORY_TOKEN.INSTRUMENT,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: InstrumentsRepository,
          useValue: {
            createInstrument: jest.fn(),
            getInstruments: jest.fn(),
          },
        },
      ],
    }).compile();

    instrumentsService = module.get<InstrumentsService>(InstrumentsService);
    instrumentRepository = module.get<InstrumentsRepository>(
      InstrumentsRepository,
    );
    utilsService = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(instrumentsService).toBeDefined();
    expect(instrumentRepository).toBeDefined();
    expect(utilsService).toBeDefined();
  });

  describe('creating a instrument', () => {
    const user = seedSingleUser();
    const instrument = seedSingleInstrument();

    it('should create a instrument', async () => {
      const body: CreateInstrumentDto = {
        title: instrument.title,
        description: instrument.description,
        location: instrument.location,
        type: instrument.type,
        condition: instrument.condition,
        price: instrument.price,
      };
      jest
        .spyOn(instrumentRepository, 'createInstrument')
        .mockResolvedValue(instrument);

      await instrumentsService.createInstrument(body, user);

      expect(instrumentRepository.createInstrument).toBeCalledTimes(1);
      expect(instrumentRepository.createInstrument).toBeCalledWith(
        body,
        user.id,
      );
    });
  });

  describe('getting instrument list', () => {
    const instruments = seedManyInstruments();
    it('should return a paginated list of instruments', async () => {
      const mockPagination: PageDto<Instruments> = {
        items: instruments,
        meta: {
          page: 1,
          take: 10,
          toal: 50,
        },
      };

      const query: PaginateOptionsDto = { take: 10, page: 1 };

      jest
        .spyOn(instrumentRepository, 'getInstruments')
        .mockResolvedValue(mockPagination);

      const result = await instrumentsService.getInsturments(query);

      expect(result).toEqual(mockPagination);
      expect(instrumentRepository.getInstruments).toBeCalledWith(query);
      expect(instrumentRepository.getInstruments).toBeCalledTimes(1);
    });
  });
});
