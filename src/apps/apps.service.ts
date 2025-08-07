import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { App, AppDocument } from './app.schema';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';

interface MongoError extends Error {
  code?: number;
}

@Injectable()
export class AppsService {
  constructor(
    @InjectModel(App.name) private readonly appModel: Model<AppDocument>,
  ) {}

  async create(createAppDto: CreateAppDto): Promise<App> {
    try {
      const createdApp = new this.appModel(createAppDto);
      return await createdApp.save();
    } catch (error) {
      const mongoError = error as MongoError;
      if (mongoError?.code === 11000) {
        throw new ConflictException('App with this appId already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<App[]> {
    return this.appModel.find().exec();
  }

  async findOne(id: string): Promise<App> {
    const app = await this.appModel.findById(id).exec();
    if (!app) {
      throw new NotFoundException(`App with ID "${id}" not found`);
    }
    return app;
  }

  async findByAppId(appId: string): Promise<App> {
    const app = await this.appModel.findOne({ appId }).exec();
    if (!app) {
      throw new NotFoundException(`App with appId "${appId}" not found`);
    }
    return app;
  }

  async update(id: string, updateAppDto: UpdateAppDto): Promise<App> {
    try {
      const updatedApp = await this.appModel
        .findByIdAndUpdate(id, updateAppDto, { new: true })
        .exec();
      if (!updatedApp) {
        throw new NotFoundException(`App with ID "${id}" not found`);
      }
      return updatedApp;
    } catch (error) {
      const mongoError = error as MongoError;
      if (mongoError?.code === 11000) {
        throw new ConflictException('App with this appId already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.appModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`App with ID "${id}" not found`);
    }
  }
}
