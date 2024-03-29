import { TimestampEntity } from 'src/entities/timestamp.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Condition } from './enums/condition.enum';
import { Type } from './enums/type.enum';
import { Users } from 'src/users/users.entity';
import { InstrumentComments } from 'src/instrument-comments/instrument-comments.entity';

@Entity('Instruments')
export class Instruments extends TimestampEntity {
  @Column({ name: 'userId', type: 'int', nullable: false })
  userId: number;

  @Index({})
  @Column({ name: 'title', type: 'varchar', nullable: false })
  title: string;

  @Index({})
  @Column({ name: 'description', type: 'text', nullable: false })
  description: string;

  @Index({})
  @Column({ name: 'price', type: 'int', nullable: false })
  price: number;

  @Index({})
  @Column({ name: 'location', type: 'varchar', nullable: false })
  location: string;

  @Column({
    name: 'condition',
    type: 'varchar',
    enum: Condition,
    nullable: false,
  })
  condition: Condition;

  @Index({})
  @Column({
    name: 'type',
    type: 'varchar',
    enum: Type,
    nullable: false,
  })
  type: Type;

  @Column({ name: 'picture', type: 'varchar', nullable: true })
  picture?: string;

  @ManyToOne(() => Users, (user) => user.instruments)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @OneToMany(
    () => InstrumentComments,
    (instrumentComment) => instrumentComment.instrument,
  )
  instrumentComments: InstrumentComments[];
}
