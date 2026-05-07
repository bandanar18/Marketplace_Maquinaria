import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() data: { name: string; logoUrl?: string }) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException();
    return this.brandsService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() data: { name?: string; logoUrl?: string }) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException();
    return this.brandsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Request() req: any, @Param('id') id: string) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException();
    return this.brandsService.delete(id);
  }
}
