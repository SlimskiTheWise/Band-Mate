import { PaginateOptionsDto } from 'src/utils/dtos/paginate.options.dto';
import { Type } from '../enums/type.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class InstrumentsFindAllDto extends PaginateOptionsDto {
  @ApiPropertyOptional({ type: String })
  title?: string;

  @ApiPropertyOptional({ type: String })
  username?: string;

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiPropertyOptional({ type: Number, default: 0 })
  minimumPrice? = 0;

  @ApiPropertyOptional({ type: Number, default: 100000000 })
  maximumPrice? = 100000000;

  @ApiPropertyOptional({ type: String })
  location?: string;

  @ApiPropertyOptional({ type: String })
  type?: Type;
}
