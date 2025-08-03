import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Platform } from '../app.schema';

export class CreateAppDto {
  @ApiProperty({
    description: 'Unique identifier for the app',
    example: 'com.mycompany.myapp',
  })
  @IsString()
  @IsNotEmpty()
  appId: string;

  @ApiProperty({
    description: 'Display name of the app',
    example: 'My App',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Platform for the app',
    enum: Platform,
    example: Platform.IOS,
  })
  @IsEnum(Platform)
  @IsNotEmpty()
  platform: Platform;
}
