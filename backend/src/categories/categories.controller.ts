import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategoryTree() {
    return this.categoriesService.getCategoryTree();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createCategory(@Request() req: any, @Body() dto: any) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException('Only SuperAdmins can create categories');
    return this.categoriesService.createCategory(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateCategory(@Request() req: any, @Param('id') id: string, @Body() dto: any) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException('Only SuperAdmins can update categories');
    return this.categoriesService.updateCategory(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteCategory(@Request() req: any, @Param('id') id: string) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException('Only SuperAdmins can delete categories');
    return this.categoriesService.deleteCategory(id);
  }
}
