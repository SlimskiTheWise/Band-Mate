import { Module } from '@nestjs/common';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Followers } from './follwers.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { FollowersRepository } from './followers.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Followers]), UsersModule],
  controllers: [FollowersController],
  providers: [FollowersService, JwtStrategy, FollowersRepository],
})
export class FollowersModule {}
