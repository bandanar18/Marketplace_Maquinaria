import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(JwtAuthGuard)
  @Get('tickets')
  getTickets(@Request() req: any) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException();
    return this.supportService.getTickets();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('tickets/:id/status')
  updateTicketStatus(@Request() req: any, @Param('id') id: string, @Body() body: { status: string }) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException();
    return this.supportService.updateTicketStatus(id, body.status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('broadcasts')
  getBroadcasts(@Request() req: any) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException();
    return this.supportService.getBroadcasts();
  }

  @UseGuards(JwtAuthGuard)
  @Post('broadcasts')
  createBroadcast(@Request() req: any, @Body() data: { title: string; message: string; target: string }) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException();
    return this.supportService.createBroadcast(req.user.id, data);
  }
}
