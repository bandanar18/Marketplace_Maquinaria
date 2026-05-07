import { Controller, Get, Patch, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getAll() {
    return this.settingsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updateMany(@Request() req: any, @Body() configs: Record<string, string>) {
    if (req.user.role !== 'SUPERADMIN') throw new UnauthorizedException();
    return this.settingsService.updateMany(configs);
  }
}
