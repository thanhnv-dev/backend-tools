import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './log.schema';
import { App, AppDocument } from '../apps/app.schema';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  appId?: string;
  userId?: string;
}

export interface LogWithApp extends Log {
  app?: {
    _id: string;
    appId: string;
    name: string;
    platform: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface MongoError extends Error {
  code?: number;
}

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
    @InjectModel(App.name) private readonly appModel: Model<AppDocument>,
  ) {}

  private async populateAppData(logs: Log[]): Promise<LogWithApp[]> {
    // Get unique app IDs from logs
    const appIds = [...new Set(logs.map((log) => log.appId).filter(Boolean))];

    // Fetch all apps at once
    const apps = await this.appModel.find({ _id: { $in: appIds } }).exec();
    const appMap = new Map(apps.map((app) => [String(app._id), app]));

    // Map logs with app data
    return logs.map((log) => {
      const logObj = this.toPlainObject(log);
      const app = log.appId ? appMap.get(log.appId) : null;

      return {
        ...logObj,
        app: app
          ? {
              _id: String(app._id),
              appId: app.appId,
              name: app.name,
              platform: app.platform,
            }
          : null,
      } as LogWithApp;
    });
  }

  private toPlainObject(log: Log): Record<string, unknown> {
    // Check if log has toObject method (Mongoose document)
    if ('toObject' in log && typeof log.toObject === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return log.toObject() as Record<string, unknown>;
    }
    // Otherwise return as plain object
    return log as unknown as Record<string, unknown>;
  }

  async create(createLogDto: CreateLogDto): Promise<Log> {
    try {
      const createdLog = new this.logModel(createLogDto);
      return await createdLog.save();
    } catch (error) {
      const mongoError = error as MongoError;
      if (mongoError?.code === 11000) {
        throw new ConflictException('Log with this data already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Log[]> {
    return this.logModel.find().exec();
  }

  async findAllPaginated(
    query: PaginationQuery,
  ): Promise<PaginatedResponse<LogWithApp>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      appId,
      userId,
    } = query;

    // Build filter object
    const filter: Record<string, any> = {};
    if (appId) {
      filter.appId = appId;
    }
    if (userId) {
      filter.userId = userId;
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Execute queries
    const [data, total] = await Promise.all([
      this.logModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.logModel.countDocuments(filter).exec(),
    ]);

    // Populate app data
    const logsWithApp = await this.populateAppData(data);

    // Calculate total pages
    const pages = Math.ceil(total / limit);

    return {
      data: logsWithApp,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  async findOne(id: string): Promise<LogWithApp> {
    const log = await this.logModel.findById(id).exec();
    if (!log) {
      throw new NotFoundException(`Log with ID "${id}" not found`);
    }

    const logsWithApp = await this.populateAppData([log]);
    return logsWithApp[0];
  }

  async findByAppId(appId: string): Promise<LogWithApp[]> {
    const logs = await this.logModel.find({ appId }).exec();
    return this.populateAppData(logs);
  }

  async findByUserId(userId: string): Promise<LogWithApp[]> {
    const logs = await this.logModel.find({ userId }).exec();
    return this.populateAppData(logs);
  }

  async update(id: string, updateLogDto: UpdateLogDto): Promise<Log> {
    try {
      const updatedLog = await this.logModel
        .findByIdAndUpdate(id, updateLogDto, { new: true })
        .exec();
      if (!updatedLog) {
        throw new NotFoundException(`Log with ID "${id}" not found`);
      }
      return updatedLog;
    } catch (error) {
      const mongoError = error as MongoError;
      if (mongoError?.code === 11000) {
        throw new ConflictException('Log with this data already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.logModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Log with ID "${id}" not found`);
    }
  }
}
