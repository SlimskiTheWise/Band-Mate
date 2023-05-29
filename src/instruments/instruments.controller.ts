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
} from '@nestjs/common';
import { InstrumentsService as InstrumentsService } from './instruments.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Instruments } from './instruments.entity';
import { CreateInstrumentDto } from './dtos/create-instument.dto';
import { Users } from 'src/users/users.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PageDto } from 'src/utils/responses/page.dto';
import { PaginateOptionsDto } from 'src/utils/dtos/paginate.options.dto';

@Controller('instruments')
@ApiTags('Instruments')
export class InstrumentsController {
  constructor(private instrumentsService: InstrumentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'creating a post for selling' })
  @Post()
  async createInstrument(
    @Body() body: CreateInstrumentDto,
    @Req() { user }: { user: Users },
  ): Promise<Instruments> {
    console.log(user);
    return this.instrumentsService.createInstrument(body, user);
  }

  @ApiOperation({ summary: 'get all instrument posts' })
  @Get()
  async getInstruments(
    @Query() query: PaginateOptionsDto,
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
