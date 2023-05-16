import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class AwsService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor(private configService: ConfigService) {
    this.awsS3 = new AWS.S3({
      region: this.configService.get<string>('aws.awsRegion'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.awsS3AccessKey'),
        secretAccessKey: this.configService.get<string>(
          'aws.awsS3AccessSecretKey',
        ),
      },
    });
    this.S3_BUCKET_NAME = this.configService.get<string>('aws.awsS3BucketName');
  }

  async uploadFileToS3(
    folder: string,
    file: Express.Multer.File,
  ): Promise<{
    key: string;
    s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    contentType: string;
  }> {
    try {
      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');

      const s3Object = await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();
      return { key, s3Object, contentType: file.mimetype };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }
}
