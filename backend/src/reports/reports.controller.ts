import { Controller, Get, Delete, Param, UseGuards, Query, Request, UnauthorizedException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getReports(@Request() req: any, @Query() query: any) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException();
    return this.reportsService.getReports(query);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteReport(@Request() req: any, @Param('id') id: string) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException();
    return this.reportsService.deleteReport(id);
  }
}
