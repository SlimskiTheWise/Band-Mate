import { InstrumentComments } from 'src/instrument-comments/instrument-comments.entity';

export function seedSingleInstrumentComment(): InstrumentComments {
  const comment = new InstrumentComments();
  comment.id = 1;
  comment.instrumentId = 1;
  comment.userId = 1;
  comment.content = 'leaving a comment';
  comment.createdAt = new Date();
  comment.updatedAt = new Date();
  comment.deletedAt = null;
  return comment;
}
