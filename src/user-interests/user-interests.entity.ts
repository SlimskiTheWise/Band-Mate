import { TimestampEntity } from 'src/entities/timestamp.entity';
import { Users } from 'src/users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Type } from './type.enum';

@Entity('UserInterests')
export class UserInterests extends TimestampEntity {
  @Column({ name: 'userId', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'type', type: 'varchar', nullable: false, enum: Type })
  type: Type;

  @ManyToOne(() => Users, (user) => user.userInterests)
  @JoinColumn({ name: 'userId' })
  user: Users;
}
