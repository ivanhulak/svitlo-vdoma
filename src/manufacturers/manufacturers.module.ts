import { Module } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ManufacturersService, PrismaService],
  exports: [ManufacturersService],
})
export class ManufacturersModule {}
