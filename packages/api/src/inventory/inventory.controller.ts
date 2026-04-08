import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.admin_a, Role.admin_b)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  getInventory() { return this.inventoryService.getInventory(); }
}
