import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateLogDto } from './create-log.dto';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsObject,
} from 'class-validator';

export class UpdateLogDto extends PartialType(CreateLogDto) {
  @ApiProperty({
    description: 'List of reason messages/events',
    example: ['0: Press watch now button', '1: Start get un viewed ads'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  reasonList?: string[];

  @ApiProperty({
    description: 'User identifier',
    example: '209',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'App version',
    example: '1.0.0-6',
    required: false,
  })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({
    description: 'Whether the operation was successful',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isSuccess?: boolean;

  @ApiProperty({
    description: 'Device information',
    example: {
      id: '7830B0B2-F412-43D1-ACC6-1A733DF3209B',
      info: 'iPhone17,4',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  deviceInfo?: {
    id?: string;
    info?: string;
  };

  @ApiProperty({
    description: 'Custom data object',
    example: {
      env: 'test',
      appId: 'ca-app-pub-4981336468921244/8981278533',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  customData?: Record<string, any>;

  @ApiProperty({
    description: 'Associated app ID',
    example: '68939c13942e1d86395e4124',
    required: false,
  })
  @IsOptional()
  @IsString()
  appId?: string;
}
