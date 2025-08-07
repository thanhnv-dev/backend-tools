import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type AppDocument = App & Document;

export enum Platform {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web',
}

@Schema({ timestamps: true })
export class App {
  @ApiProperty({
    description: 'Identifier for the app',
    example: 'com.mycompany.myapp',
  })
  @Prop({ required: true })
  appId: string;

  @ApiProperty({
    description: 'Display name of the app',
    example: 'My App',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Platform for the app',
    enum: Platform,
    example: Platform.IOS,
  })
  @Prop({ required: true, enum: Platform })
  platform: Platform;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-08-03T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-08-03T10:30:00.000Z',
  })
  updatedAt: Date;
}

export const AppSchema = SchemaFactory.createForClass(App);
