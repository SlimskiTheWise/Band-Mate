import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from './aws.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('AWS')
@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadMediaFile(@UploadedFile() file: Express.Multer.File) {
    return await this.awsService.uploadFileToS3('test', file);
  }
}
