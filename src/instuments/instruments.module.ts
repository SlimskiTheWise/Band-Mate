import { Module } from '@nestjs/common';
import { InstrumentsController } from './instruments.controller';
import { InstrumentsService } from './instruments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instruments } from './instruments.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { InstrumentsRepository } from './instruments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Instruments]), UtilsModule],
  controllers: [InstrumentsController],
  providers: [InstrumentsService, InstrumentsRepository],
})
export class InstrumentModule {}
