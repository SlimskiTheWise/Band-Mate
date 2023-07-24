import { PaginateOptionsDto } from 'src/utils/dtos/paginate.options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'src/user-interests/type.enum';

export class UsersFindAllDto extends PaginateOptionsDto {
  @ApiPropertyOptional({ type: String })
  name?: string;

  @ApiPropertyOptional({ type: String })
  username?: string;

  @ApiPropertyOptional({ type: String })
  userInterest?: Type;
}
