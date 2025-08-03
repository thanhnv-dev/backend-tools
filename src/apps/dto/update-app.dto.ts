import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAppDto } from './create-app.dto';
import { Platform } from '../app.schema';

export class UpdateAppDto extends PartialType(CreateAppDto) {
  @ApiProperty({
    description: 'Unique identifier for the app',
    example: 'com.mycompany.myapp',
    required: false,
  })
  appId?: string;

  @ApiProperty({
    description: 'Display name of the app',
    example: 'My Updated App',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Platform for the app',
    enum: Platform,
    example: Platform.ANDROID,
    required: false,
  })
  platform?: Platform;
}
