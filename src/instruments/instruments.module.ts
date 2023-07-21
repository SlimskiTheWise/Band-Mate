import { Module } from '@nestjs/common';
import { InstrumentsController } from './instruments.controller';
import { InstrumentsService } from './instruments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instruments } from './instruments.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { InstrumentsRepository } from './instruments.repository';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([Instruments]), UtilsModule, AwsModule],
  controllers: [InstrumentsController],
  providers: [InstrumentsService, InstrumentsRepository],
})
export class InstrumentModule {}
