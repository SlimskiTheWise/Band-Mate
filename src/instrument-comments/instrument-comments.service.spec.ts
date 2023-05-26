import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentCommentsService } from './instrument-comments.service';
import { InstrumentCommentsRepository } from './instrument-comments.repository';

describe('InstrumentCommentsService', () => {
  let instrumentCommentsService: InstrumentCommentsService;
  let instrumentCommentsRepository: InstrumentCommentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstrumentCommentsService,
        {
          provide: InstrumentCommentsRepository,
          useValue: {},
        },
      ],
    }).compile();

    instrumentCommentsService = module.get<InstrumentCommentsService>(
      InstrumentCommentsService,
    );
    instrumentCommentsRepository = module.get<InstrumentCommentsRepository>(
      InstrumentCommentsRepository,
    );
  });

  it('should be defined', () => {
    expect(instrumentCommentsService).toBeDefined();
    expect(instrumentCommentsRepository).toBeDefined();
  });
});
