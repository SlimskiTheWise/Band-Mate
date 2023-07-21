import { Type } from '../enums/type.enum';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Condition } from '../enums/condition.enum';

export class CreateInstrumentDto {
  @ApiProperty({ description: 'title', type: 'string' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'description', type: 'string' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'price', type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'location', type: 'string' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ description: 'condition of the item', enum: Condition })
  @IsNotEmpty()
  @IsString()
  condition: Condition;

  @ApiProperty({ description: 'type of instrument', enum: Type })
  @IsNotEmpty()
  @IsString()
  type: Type;

  @ApiProperty({ type: 'string', format: 'binary', nullable: true })
  picture?: string;
}
