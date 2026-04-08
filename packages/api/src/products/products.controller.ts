import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll() { return this.productsService.findAll(); }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) { return this.productsService.findById(id); }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.admin_a, Role.admin_b)
  create(@Body() body: { name: string; description?: string; price: number; stock: number; imageUrl?: string }) {
    return this.productsService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.admin_a, Role.admin_b)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) { return this.productsService.update(id, body); }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.admin_a, Role.admin_b)
  delete(@Param('id', ParseIntPipe) id: number) { return this.productsService.delete(id); }
}
