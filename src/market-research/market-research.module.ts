import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MarketResearchService } from './market-research.service';

@Module({
  providers: [MarketResearchService, PrismaService],
  exports: [MarketResearchService],
})
export class MarketResearchModule {}
