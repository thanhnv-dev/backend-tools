import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiSecurity,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('Logs')
@ApiSecurity('x-api-key')
@Controller('logs')
@UseGuards(ApiKeyGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new log' })
  @ApiBody({ type: CreateLogDto })
  @ApiResponse({
    status: 201,
    description: 'The log has been successfully created.',
    schema: {
      example: {
        _id: '64a1b2c3d4e5f6789abc1234',
        reasonList: ['0: Press watch now button', '1: Start get un viewed ads'],
        userId: '209',
        version: '1.0.0-6',
        isSuccess: false,
        deviceInfo: {
          id: '7830B0B2-F412-43D1-ACC6-1A733DF3209B',
          info: 'iPhone17,4',
        },
        customData: {
          env: 'test',
          appId: 'ca-app-pub-4981336468921244/8981278533',
        },
        appId: '68939c13942e1d86395e4124',
        createdAt: '2025-07-24T17:18:00.852Z',
        updatedAt: '2025-07-24T17:18:00.852Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid API key.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - log with this data already exists.',
  })
  create(@Body(ValidationPipe) createLogDto: CreateLogDto) {
    return this.logsService.create(createLogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all logs with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default: 10, max: 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by (default: createdAt)',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc, default: desc)',
    example: 'desc',
  })
  @ApiQuery({
    name: 'appId',
    required: false,
    description: 'Filter logs by app ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter logs by user ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Return paginated logs.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            example: {
              _id: '64a1b2c3d4e5f6789abc1234',
              reasonList: [
                '0: Press watch now button',
                '1: Start get un viewed ads',
              ],
              userId: '209',
              version: '1.0.0-6',
              isSuccess: false,
              deviceInfo: {
                id: '7830B0B2-F412-43D1-ACC6-1A733DF3209B',
                info: 'iPhone17,4',
              },
              customData: {
                env: 'test',
                appId: 'ca-app-pub-4981336468921244/8981278533',
              },
              appId: '68939c13942e1d86395e4124',
              app: {
                _id: '68939c13942e1d86395e4124',
                appId: 'com.example.myapp',
                name: 'My App',
                platform: 'ios',
              },
              createdAt: '2025-07-24T17:18:00.852Z',
              updatedAt: '2025-07-24T17:18:00.852Z',
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 100 },
            pages: { type: 'number', example: 10 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid API key.' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('appId') appId?: string,
    @Query('userId') userId?: string,
  ) {
    // Parse pagination parameters
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 10; // Max 100 items per page

    return this.logsService.findAllPaginated({
      page: pageNum,
      limit: limitNum,
      sortBy,
      sortOrder,
      appId,
      userId,
    });
  }

  @Get('legacy/all')
  @ApiOperation({ summary: 'Get all logs (legacy endpoint - deprecated)' })
  @ApiQuery({
    name: 'appId',
    required: false,
    description: 'Filter logs by app ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter logs by user ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all logs or filtered logs.',
    schema: {
      type: 'array',
      items: {
        example: {
          _id: '64a1b2c3d4e5f6789abc1234',
          reasonList: [
            '0: Press watch now button',
            '1: Start get un viewed ads',
          ],
          userId: '209',
          version: '1.0.0-6',
          isSuccess: false,
          deviceInfo: {
            id: '7830B0B2-F412-43D1-ACC6-1A733DF3209B',
            info: 'iPhone17,4',
          },
          customData: {
            env: 'test',
            appId: 'ca-app-pub-4981336468921244/8981278533',
          },
          appId: '68939c13942e1d86395e4124',
          createdAt: '2025-07-24T17:18:00.852Z',
          updatedAt: '2025-07-24T17:18:00.852Z',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid API key.' })
  async findAllLegacy(
    @Query('appId') appId?: string,
    @Query('userId') userId?: string,
  ) {
    if (appId) {
      return this.logsService.findByAppId(appId);
    }
    if (userId) {
      return this.logsService.findByUserId(userId);
    }
    return this.logsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a log by ID' })
  @ApiParam({ name: 'id', description: 'Log ID (MongoDB ObjectId)' })
  @ApiResponse({
    status: 200,
    description: 'Return the log.',
    schema: {
      example: {
        _id: '64a1b2c3d4e5f6789abc1234',
        reasonList: ['0: Press watch now button', '1: Start get un viewed ads'],
        userId: '209',
        version: '1.0.0-6',
        isSuccess: false,
        deviceInfo: {
          id: '7830B0B2-F412-43D1-ACC6-1A733DF3209B',
          info: 'iPhone17,4',
        },
        customData: {
          env: 'test',
          appId: 'ca-app-pub-4981336468921244/8981278533',
        },
        appId: '68939c13942e1d86395e4124',
        app: {
          _id: '68939c13942e1d86395e4124',
          appId: 'com.example.myapp',
          name: 'My App',
          platform: 'ios',
        },
        createdAt: '2025-07-24T17:18:00.852Z',
        updatedAt: '2025-07-24T17:18:00.852Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid API key.' })
  @ApiResponse({ status: 404, description: 'Log not found.' })
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a log' })
  @ApiParam({ name: 'id', description: 'Log ID (MongoDB ObjectId)' })
  @ApiBody({ type: UpdateLogDto })
  @ApiResponse({
    status: 200,
    description: 'The log has been successfully updated.',
    schema: {
      example: {
        _id: '64a1b2c3d4e5f6789abc1234',
        reasonList: ['0: Updated reason', '1: Updated action'],
        userId: '209',
        version: '1.0.0-7',
        isSuccess: true,
        deviceInfo: {
          id: '7830B0B2-F412-43D1-ACC6-1A733DF3209B',
          info: 'iPhone17,4',
        },
        customData: {
          env: 'production',
          appId: 'ca-app-pub-4981336468921244/8981278533',
        },
        appId: '68939c13942e1d86395e4124',
        createdAt: '2025-07-24T17:18:00.852Z',
        updatedAt: '2025-07-24T18:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid API key.' })
  @ApiResponse({ status: 404, description: 'Log not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - log with this data already exists.',
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateLogDto: UpdateLogDto,
  ) {
    return this.logsService.update(id, updateLogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a log' })
  @ApiParam({ name: 'id', description: 'Log ID (MongoDB ObjectId)' })
  @ApiResponse({
    status: 204,
    description: 'The log has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid API key.' })
  @ApiResponse({ status: 404, description: 'Log not found.' })
  remove(@Param('id') id: string) {
    return this.logsService.remove(id);
  }
}
