import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MarketResearchService {
  constructor(private prisma: PrismaService) {}

  async updateItems(productArray: Product[]) {
    await this.prisma.marketResearch.deleteMany();
    // @ts-ignore
    await this.prisma.marketResearch.createMany({ data: productArray });
  }
}
