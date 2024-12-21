import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ManufacturersService {
  constructor(private prisma: PrismaService) {}
  async findManufacturersByIds(
    ids: string[],
    options?: Prisma.SupplierFindManyArgs,
  ) {
    return this.prisma.supplier.findMany({
      where: { id: { in: ids } },
      ...options,
    });
  }
  async findById(id: string, options?: Prisma.SupplierFindManyArgs) {
    return this.prisma.supplier.findFirst({
      where: { id },
      ...options,
    });
  }
}
