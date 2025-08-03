import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';
import { App, AppSchema } from './app.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: App.name, schema: AppSchema }])],
  controllers: [AppsController],
  providers: [AppsService],
})
export class AppsModule {}
