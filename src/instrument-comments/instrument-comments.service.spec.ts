import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentCommentsService } from './instrument-comments.service';
import { InstrumentCommentsRepository } from './instrument-comments.repository';
import { UpdateInstrumentComment } from './interfaces/update-instrument-comment.interface';
import { seedSingleInstrumentComment } from 'src/test/mock-data/instrument-comments-mock.data';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { InstrumentComments } from './instrument-comments.entity';

describe('InstrumentCommentsService', () => {
  let instrumentCommentsService: InstrumentCommentsService;
  let instrumentCommentsRepository: InstrumentCommentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [
        InstrumentCommentsService,
        {
          provide: InstrumentCommentsRepository,
          useValue: {
            getInstrumentCommentById: jest.fn(),
            updateInstrumentComment: jest.fn(),
          },
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

  describe('update an instrument comment', () => {
    const comment = seedSingleInstrumentComment();
    const updateComment: UpdateInstrumentComment = {
      userId: comment.userId,
      instrumentCommentId: comment.id,
      content: 'updating a comment',
    };
    it('should update an instrument comment', async () => {
      jest
        .spyOn(instrumentCommentsRepository, 'getInstrumentCommentById')
        .mockResolvedValue(comment);

      await instrumentCommentsService.updateInstrumentComment(updateComment);

      expect(
        instrumentCommentsRepository.getInstrumentCommentById,
      ).toBeCalledTimes(1);
      expect(
        instrumentCommentsRepository.getInstrumentCommentById,
      ).toBeCalledWith(updateComment.instrumentCommentId);
    });

    it('should throw an error when comment does not exist', async () => {
      const wrongCommentId = 100;
      jest
        .spyOn(instrumentCommentsRepository, 'getInstrumentCommentById')
        .mockResolvedValue(undefined);

      expect(
        instrumentCommentsService.updateInstrumentComment({
          ...updateComment,
          instrumentCommentId: wrongCommentId,
        }),
      ).rejects.toThrowError();
    });

    it('should throw an error when logged in user is not the author', async () => {
      const wrongUserId = 100;
      const wrongComment: InstrumentComments = {
        ...comment,
        userId: wrongUserId,
        beforeInsert: undefined,
        beforeUpdate: undefined,
      };
      jest
        .spyOn(instrumentCommentsRepository, 'getInstrumentCommentById')
        .mockResolvedValue(wrongComment);

      expect(
        instrumentCommentsService.updateInstrumentComment({
          ...updateComment,
          instrumentCommentId: updateComment.instrumentCommentId,
        }),
      ).rejects.toThrowError();
    });
  });
});
