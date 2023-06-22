import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { Followers } from 'src/followers/follwers.entity';
import { Type } from 'src/user-interests/type.enum';

class InstrumentsResponse {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  title: string;
}

class FollowersAndFollowing {
  @ApiProperty({ isArray: true })
  followers: Followers[];

  @ApiProperty({ isArray: true })
  following: Followers[];
}

export class UsersProfileResponse {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ type: String })
  profilePictureUrl?: string;

  @ApiPropertyOptional({ type: String })
  bio?: string;

  @ApiPropertyOptional({
    isArray: true,
    example: [
      {
        id: 9,
        title: 'asdasdasd',
      },
      {
        id: 10,
        title: 'asdasdasd',
      },
    ],
  })
  instruments?: InstrumentsResponse[];

  @ApiPropertyOptional({
    isArray: true,
  })
  userInterests?: Type[];

  @ApiProperty({
    description: 'number of following and followers of user',
    example: {
      followers: 1,
      following: 2,
    },
  })
  followersAndFollowing: FollowersAndFollowing;
}
