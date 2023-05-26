import { AbstractEntity } from 'src/entities/abstract.entity';
import { TimestampEntity } from 'src/entities/timestamp.entity';
import { Instruments } from 'src/instruments/instruments.entity';
import { Users } from 'src/users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('InstrumentComments')
export class InstrumentComments extends TimestampEntity {
  @Column({ name: 'userId', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'instrumentId', type: 'int', nullable: false })
  instrumentId: number;

  @Column({ name: 'content', type: 'varchar', nullable: false })
  content: string;

  @ManyToOne(() => Users, (user) => user.instrumentComments)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Instruments, (instruments) => instruments.instrumentComments)
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instruments;
}
