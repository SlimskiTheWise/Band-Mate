import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InstrumentCommentsService } from './instrument-comments.service';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateInstrumentCommentDto } from './dtos/create-instrument-comment.dto';
import { Users } from 'src/users/users.entity';
import { CreateInstrumentComment } from './interfaces/create-intrument-comment.interface';

@Controller('instrument-comments')
export class InstrumentCommentsController {
  constructor(
    private readonly instrumentCommentsService: InstrumentCommentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'user can leave a comment on an instrument post' })
  @Post(':instrumentId')
  async createInstrumentComment(
    @Body() { content }: CreateInstrumentCommentDto,
    @Req() { user }: { user: Users },
    @Param('instrumentId', ParseIntPipe) instrumentId: number,
  ): Promise<void> {
    const comment: CreateInstrumentComment = {
      userId: user.id,
      instrumentId,
      content,
    };
    await this.instrumentCommentsService.createInstrumentComment(comment);
  }
}
