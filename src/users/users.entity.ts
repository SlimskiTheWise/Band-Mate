import { Role } from 'src/common/enums/role.enum';
import { TimestampEntity } from 'src/entities/timestamp.entity';
import { Followers } from 'src/followers/follwers.entity';
import { InstrumentComments } from 'src/instrument-comments/instrument-comments.entity';
import { Instruments } from 'src/instruments/instruments.entity';
import { UserInterests } from 'src/user-interests/user-interests.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('Users')
export class Users extends TimestampEntity {
  @Column({ name: 'email', type: 'varchar', nullable: false })
  email: string;

  // when signing up using Google OAuth, username can be nullable
  @Column({ name: 'username', type: 'varchar', nullable: true })
  username?: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken?: string;

  @Column({
    name: 'role',
    type: 'varchar',
    default: Role.USER,
    enum: Role,
    nullable: false,
  })
  role: Role;

  @Column({ name: 'profilePictureUrl', type: 'varchar', nullable: true })
  profilePictureUrl?: string;

  @Column({ name: 'lastLogin', type: 'date', nullable: true })
  lastLogin?: Date;

  @Column({ name: 'bio', type: 'varchar', nullable: true })
  bio: string;

  @ManyToOne(() => Followers, (follower) => follower.following)
  @JoinColumn({ name: 'followedUserId' })
  followers: Followers[];

  @ManyToOne(() => Followers, (follower) => follower.follower)
  @JoinColumn({ name: 'followingUserId' })
  following: Followers[];

  @OneToMany(() => Instruments, (instrument) => instrument.user)
  instruments: Instruments[];

  @OneToMany(
    () => InstrumentComments,
    (instrumentComment) => instrumentComment.user,
  )
  instrumentComments: InstrumentComments[];

  @OneToMany(() => UserInterests, (userInterest) => userInterest.user)
  userInterests: UserInterests[];
}
