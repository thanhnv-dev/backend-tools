import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Role } from '../user.schema';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'User email address',
    example: 'updated@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    required: false,
  })
  password?: string;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.ADMIN,
    required: false,
  })
  role?: Role;
}
