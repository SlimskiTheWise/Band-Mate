import { InstrumentCommentsRepository } from './instrument-comments.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateInstrumentComment } from './interfaces/create-intrument-comment.interface';
import { UpdateInstrumentComment } from './interfaces/update-instrument-comment.interface';

@Injectable()
export class InstrumentCommentsService {
  constructor(
    private readonly instrumentCommentsRepository: InstrumentCommentsRepository,
  ) {}

  async createInstrumentComment(
    comment: CreateInstrumentComment,
  ): Promise<void> {
    await this.instrumentCommentsRepository.createInstrumentComment(comment);
  }

  async updateInstrumentComment(
    comment: UpdateInstrumentComment,
  ): Promise<void> {
    const commentExists =
      await this.instrumentCommentsRepository.getInstrumentCommentById(
        comment.instrumentCommentId,
      );
    if (!commentExists) {
      throw new NotFoundException('comment not found');
    }

    if (comment.userId !== commentExists.userId) {
      throw new UnauthorizedException();
    }

    await this.instrumentCommentsRepository.updateInstrumentComment({
      ...comment,
    });
  }

  async deleteInstrumentComment(userId: number, instrumentCommentId: number) {
    const commentExists =
      await this.instrumentCommentsRepository.getInstrumentCommentById(
        instrumentCommentId,
      );
    if (!commentExists) {
      throw new NotFoundException('comment not found');
    }

    if (userId !== commentExists.userId) {
      throw new UnauthorizedException();
    }
    await this.instrumentCommentsRepository.deleteInstrumentComment(
      instrumentCommentId,
    );
  }
}
