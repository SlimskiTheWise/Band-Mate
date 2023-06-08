import { ApiProperty } from '@nestjs/swagger';

export class UsersCountsResponse {
  @ApiProperty({ description: 'total number of users' })
  totalUsers: number;

  @ApiProperty({ description: 'users who joined current month' })
  usersJoinedThisMonth: number;

  @ApiProperty({ description: 'users who have logged in in the past 30 days' })
  activeUsers: number;
}
