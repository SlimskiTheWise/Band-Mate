import { Module } from '@nestjs/common';
import { UserInterestsController } from './user-interests.controller';
import { UserInterestsService } from './user-interests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInterests } from './user-interests.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { UserInterestsRepository } from './user-interests.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserInterests])],
  controllers: [UserInterestsController],
  providers: [UserInterestsService, JwtStrategy, UserInterestsRepository],
})
export class UserInterestsModule {}
