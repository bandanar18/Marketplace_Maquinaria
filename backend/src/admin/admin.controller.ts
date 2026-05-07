import { Controller, Get, UseGuards, Request, UnauthorizedException, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getGlobalStats(@Request() req: any) {
    if (req.user.role !== 'SUPERADMIN') {
      throw new UnauthorizedException('Only SuperAdmins can access global stats');
    }
    return this.adminService.getGlobalStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('export/:entity')
  async exportData(@Request() req: any, @Param('entity') entity: string) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException();
    return this.adminService.exportToCsv(entity);
  }
}
