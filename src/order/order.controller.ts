import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UnauthorizedDto } from 'src/auth/dto/unauthorizedDto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(JwtGuard)
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
  })
  @ApiOperation({ summary: 'Get all orders' })
  async getAllOrders() {
    return this.orderService.getAllOrdersWithItems();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
  })
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  async getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }
  @Post()
  @UseGuards(JwtGuard)
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
  })
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
  })
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderDto })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }
}
