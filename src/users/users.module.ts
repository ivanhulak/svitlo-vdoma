import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './users.controller';

@Module({
  providers: [UsersService, PrismaService],
  exports: [UsersService],
  controllers: [UserController],
})
export class UsersModule {}
