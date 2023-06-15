import { AbstractEntity } from 'src/entities/abstract.entity';
import { Column, Entity } from 'typeorm';
import { Type } from './enums/type.enum';

@Entity('VerificationCodes')
export class VerificationCodes extends AbstractEntity {
  @Column({ name: 'code', type: 'varchar', nullable: false })
  code: string;

  @Column({ name: 'email', type: 'varchar', nullable: false })
  email: string;

  @Column({
    name: 'type',
    type: 'varchar',
    nullable: false,
    default: Type.SIGNUP,
    enum: Type,
  })
  type: Type;

  @Column({
    name: 'isVerified',
    nullable: false,
    default: false,
    type: 'boolean',
  })
  isVerified = false;
}
