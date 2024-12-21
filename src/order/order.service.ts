import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getAllOrdersWithItems() {
    return this.prisma.order.findMany({
      include: {
        items: true,
      },
    });
  }

  async getOrderById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  async getSeasonOrders() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);

    return this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId, items, totalAmount, status } = createOrderDto;
    return this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        status,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    const { items, totalAmount, status } = updateOrderDto;
    return this.prisma.order.update({
      where: { id },
      data: {
        totalAmount,
        status,
        items: items
          ? {
              deleteMany: {},
              create: items as any,
            }
          : undefined,
      },
      include: {
        items: true,
      },
    });
  }
}
