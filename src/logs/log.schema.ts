import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @ApiProperty({
    description: 'List of reason messages/events',
    example: ['0: Press watch now button', '1: Start get un viewed ads'],
    type: [String],
  })
  @Prop({ type: [String], default: [] })
  reasonList: string[];

  @ApiProperty({
    description: 'User identifier',
    example: '209',
  })
  @Prop({ required: false })
  userId?: string;

  @ApiProperty({
    description: 'App version',
    example: '1.0.0-6',
  })
  @Prop({ required: false })
  version?: string;

  @ApiProperty({
    description: 'Whether the operation was successful',
    example: false,
  })
  @Prop({ default: false })
  isSuccess: boolean;

  @ApiProperty({
    description: 'Device information',
    example: {
      id: '7830B0B2-F412-43D1-ACC6-1A733DF3209B',
      info: 'iPhone17,4',
    },
  })
  @Prop({
    type: {
      id: { type: String, required: false },
      info: { type: String, required: false },
    },
    required: false,
  })
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
  })
  @Prop({ type: Object, required: false })
  customData?: Record<string, any>;

  @ApiProperty({
    description: 'Associated app ID',
    example: '68939c13942e1d86395e4124',
  })
  @Prop({ required: false })
  appId?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-07-24T17:18:00.852Z',
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-07-24T17:18:00.852Z',
  })
  @Prop()
  updatedAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
