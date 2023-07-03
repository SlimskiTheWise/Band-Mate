import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InstrumentsService as InstrumentsService } from './instruments.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Instruments } from './instruments.entity';
import { CreateInstrumentDto } from './dtos/create-instument.dto';
import { Users } from 'src/users/users.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PageDto } from 'src/utils/responses/page.dto';
import { InstrumentsFindAllDto } from './dtos/instruments-find-all.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

@Controller('instruments')
@ApiTags('Instruments')
export class InstrumentsController {
  constructor(
    private instrumentsService: InstrumentsService,
    private readonly awsService: AwsService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'creating a post for selling' })
  @Post()
  @UseInterceptors(FileInterceptor('instrumentPicture'))
  async createInstrument(
    @Body() body: CreateInstrumentDto,
    @Req() { user }: { user: Users },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Instruments> {
    if (file) {
      const { key } = await this.awsService.uploadFileToS3(
        'test/instrument',
        file,
      );
      body.picture = key;
    }
    return this.instrumentsService.createInstrument(body, user);
  }

  @ApiOperation({ summary: 'get all instrument posts' })
  @Get()
  async getInstruments(
    @Query() query: InstrumentsFindAllDto,
  ): Promise<PageDto<Instruments>> {
    return this.instrumentsService.getInsturments(query);
  }

  @ApiOperation({ summary: 'instrument in detail ' })
  @Get(':instrumentId')
  async getInstrumentById(
    @Param('instrumentId', ParseIntPipe) instrumentId: number,
  ): Promise<Instruments> {
    return this.instrumentsService.getInstrumentById(instrumentId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'delete instrument' })
  @Delete(':instrumentId')
  async deleteInstrument(
    @Param('instrumentId', ParseIntPipe) instrumentId: number,
    @Req() { user }: { user: Users },
  ): Promise<void> {
    return this.instrumentsService.deleteInstrument(user, instrumentId);
  }
}
