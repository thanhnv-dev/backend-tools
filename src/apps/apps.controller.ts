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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiSecurity,
  ApiBody,
} from '@nestjs/swagger';
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('Apps')
@ApiSecurity('x-api-key')
@Controller('apps')
@UseGuards(ApiKeyGuard)
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new app' })
  @ApiBody({ type: CreateAppDto })
  @ApiResponse({
    status: 201,
    description: 'The app has been successfully created.',
    schema: {
      example: {
        _id: '64a1b2c3d4e5f6789abc1234',
        appId: 'com.mycompany.myapp',
        name: 'My App',
        platform: 'ios',
        createdAt: '2024-08-03T10:30:00.000Z',
        updatedAt: '2024-08-03T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid API key.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - app with this appId already exists.',
  })
  create(@Body(ValidationPipe) createAppDto: CreateAppDto) {
    return this.appsService.create(createAppDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all apps' })
  @ApiResponse({
    status: 200,
    description: 'Return all apps.',
    schema: {
      type: 'array',
      items: {
        example: {
          _id: '64a1b2c3d4e5f6789abc1234',
          appId: 'com.mycompany.myapp',
          name: 'My App',
          platform: 'ios',
          createdAt: '2024-08-03T10:30:00.000Z',
          updatedAt: '2024-08-03T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid API key.' })
  findAll() {
    return this.appsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an app by ID' })
  @ApiParam({ name: 'id', description: 'App ID (MongoDB ObjectId)' })
  @ApiResponse({
    status: 200,
    description: 'Return the app.',
    schema: {
      example: {
        _id: '64a1b2c3d4e5f6789abc1234',
        appId: 'com.mycompany.myapp',
        name: 'My App',
        platform: 'ios',
        createdAt: '2024-08-03T10:30:00.000Z',
        updatedAt: '2024-08-03T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid API key.' })
  @ApiResponse({ status: 404, description: 'App not found.' })
  findOne(@Param('id') id: string) {
    return this.appsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an app' })
  @ApiParam({ name: 'id', description: 'App ID (MongoDB ObjectId)' })
  @ApiBody({ type: UpdateAppDto })
  @ApiResponse({
    status: 200,
    description: 'The app has been successfully updated.',
    schema: {
      example: {
        _id: '64a1b2c3d4e5f6789abc1234',
        appId: 'com.mycompany.myapp',
        name: 'My Updated App',
        platform: 'android',
        createdAt: '2024-08-03T10:30:00.000Z',
        updatedAt: '2024-08-03T11:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid API key.' })
  @ApiResponse({ status: 404, description: 'App not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - app with this appId already exists.',
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateAppDto: UpdateAppDto,
  ) {
    return this.appsService.update(id, updateAppDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an app' })
  @ApiParam({ name: 'id', description: 'App ID (MongoDB ObjectId)' })
  @ApiResponse({
    status: 204,
    description: 'The app has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid API key.' })
  @ApiResponse({ status: 404, description: 'App not found.' })
  remove(@Param('id') id: string) {
    return this.appsService.remove(id);
  }
}
