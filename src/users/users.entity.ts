import { Role } from 'src/common/enums/role.enum';
import { TimestampEntity } from 'src/entities/timestamp.entity';
import { Followers } from 'src/followers/follwers.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('Users')
export class Users extends TimestampEntity {
  @Column({ name: 'email', type: 'varchar', nullable: false })
  email: string;

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

  @ManyToOne(() => Followers, (follower) => follower.following)
  @JoinColumn({ name: 'followedUserId' })
  followers: Followers[];

  @ManyToOne(() => Followers, (follower) => follower.follower)
  @JoinColumn({ name: 'followingUserId' })
  following: Followers[];

  @Column({ name: 'profile_picture_url', type: 'varchar', nullable: true })
  profilePictureUrl: string;
}
