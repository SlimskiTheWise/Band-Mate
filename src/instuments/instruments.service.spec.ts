import { InstrumentsRepository } from './instruments.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentsService } from './instruments.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { REPOSITORY_TOKEN } from 'src/test/repository-token';
import { seedSingleUser } from 'src/test/mock-data/user-mock-data';
import { seedSingleInstrument } from 'src/test/mock-data/instrument-mock.data';
import { CreateInstrumentDto } from './dtos/create-instument.dto';

describe('InstrumentsService', () => {
  let instrumentsService: InstrumentsService;
  let instrumentRepository: InstrumentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [
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
          },
        },
      ],
    }).compile();

    instrumentsService = module.get<InstrumentsService>(InstrumentsService);
    instrumentRepository = module.get<InstrumentsRepository>(
      InstrumentsRepository,
    );
  });

  it('should be defined', () => {
    expect(instrumentsService).toBeDefined();
    expect(instrumentRepository).toBeDefined();
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
});
