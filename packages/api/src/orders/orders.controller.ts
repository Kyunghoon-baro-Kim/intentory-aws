import { Controller, Get, Post, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() body: { items: { productId: number; quantity: number }[]; referralCode?: string }) {
    return this.ordersService.create(user.id, body.items, body.referralCode);
  }

  @Get()
  findAll(@CurrentUser() user: any) { return this.ordersService.findAll(user.id, user.role); }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) { return this.ordersService.findById(id); }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.admin_a, Role.admin_b)
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
