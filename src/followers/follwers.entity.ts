import { AbstractEntity } from 'src/entities/abstract.entity';
import { Users } from 'src/users/users.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('Followers')
export class Followers extends AbstractEntity {
  @Column({ name: 'follwingUserId', type: 'int', nullable: false })
  followingUserId: number;

  @Column({ name: 'follwedUserId', type: 'int', nullable: false })
  follwedUserId: number;

  @OneToMany(() => Users, (user) => user.followers)
  follower: Users;

  @OneToMany(() => Users, (user) => user.following)
  following: Users;
}
