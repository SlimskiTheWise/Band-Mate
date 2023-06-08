import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UtilsModule } from 'src/utils/utils.module';
import { Users } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { MailModule } from 'src/mail/mail.module';
import { AwsModule } from 'src/aws/aws.module';
import { AdminGuard } from 'src/auth/guards/admin-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    UtilsModule,
    MailModule,
    AwsModule,
    JwtModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AdminGuard],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
