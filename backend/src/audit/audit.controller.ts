import { Controller, Get, Query, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @UseGuards(JwtAuthGuard)
  @Get('logs')
  getLogs(@Request() req: any, @Query() query: any) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException();
    return this.auditService.getLogs(query);
  }
}
