import { AbstractEntity } from 'src/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('VerificationCodes')
export class VerificationCodes extends AbstractEntity {
  @Column({ name: 'code', type: 'varchar', nullable: false })
  code: string;

  @Column({ name: 'email', type: 'varchar', nullable: false })
  email: string;

  @Column({
    name: 'isVerified',
    nullable: false,
    default: false,
    type: 'boolean',
  })
  isVerified = false;
}
