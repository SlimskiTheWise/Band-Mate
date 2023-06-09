import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import configuration from './config/configuration';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './auth/auth.module';
import { FollowersModule } from './followers/followers.module';
import { AwsModule } from './aws/aws.module';
import { InstrumentModule } from './instruments/instruments.module';
import { MailModule } from './mail/mail.module';
import { InstrumentCommentsModule } from './instrument-comments/instrument-comments.module';
import { UserInterestsModule } from './user-interests/user-interests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('database.host'),
          port: 5432,
          username: config.get<string>('database.username'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    UtilsModule,
    AuthModule,
    FollowersModule,
    AwsModule,
    InstrumentModule,
    MailModule,
    InstrumentCommentsModule,
    UserInterestsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
