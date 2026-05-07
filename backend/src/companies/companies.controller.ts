import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Request, Param, Query, UnauthorizedException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  getAllCompanies(@Query() query: any) {
    return this.companiesService.getAllCompanies(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyCompany(@Request() req: any) {
    return this.companiesService.getMyCompany(req.user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMyCompany(@Request() req: any, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.updateMyCompany(req.user.companyId, req.user.id, updateCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getCompanyStats(@Request() req: any) {
    return this.companiesService.getCompanyStats(req.user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/customers')
  getMyCompanyCustomers(@Request() req: any) {
    if (!req.user.companyId) throw new UnauthorizedException('No company associated');
    return this.companiesService.getCompanyCustomers(req.user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/members')
  getMembers(@Request() req: any) {
    if (!req.user.companyId) throw new UnauthorizedException();
    return this.companiesService.getCompanyMembers(req.user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/invites')
  getInvites(@Request() req: any) {
    if (!req.user.companyId) throw new UnauthorizedException();
    return this.companiesService.getCompanyInvites(req.user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('my/invites')
  invite(@Request() req: any, @Body() body: { email: string; role: string }) {
    if (!req.user.companyId || req.user.companyRole === 'MEMBER') throw new UnauthorizedException();
    return this.companiesService.inviteMember(req.user.companyId, body.email, body.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my/invites/:id/cancel')
  cancelInvite(@Request() req: any, @Param('id') id: string) {
    if (!req.user.companyId || req.user.companyRole === 'MEMBER') throw new UnauthorizedException();
    return this.companiesService.cancelInvite(id, req.user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('my/members/:id')
  removeMember(@Request() req: any, @Param('id') id: string) {
    if (!req.user.companyId || req.user.companyRole !== 'OWNER') throw new UnauthorizedException();
    return this.companiesService.removeMember(req.user.companyId, id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('my/inventory/import')
  importInventory(@Request() req: any, @Body() body: { csvData: string }) {
    if (!req.user.companyId) throw new UnauthorizedException();
    return this.companiesService.importInventory(req.user.companyId, body.csvData);
  }

  @Get(':slug')
  getCompanyBySlug(@Param('slug') slug: string) {
    return this.companiesService.getCompanyBySlug(slug);
  }

  @Get(':slug/products')
  getCompanyProducts(
    @Param('slug') slug: string,
    @Query() query: any
  ) {
    return this.companiesService.getCompanyProducts(slug, query);
  }

  // --- ADMIN ENDPOINTS ---
  
  @UseGuards(JwtAuthGuard)
  @Get('admin/list')
  getAdminCompanies(@Request() req: any, @Query() query: any) {
    if (req.user.role !== 'SUPERADMIN') {
      throw new UnauthorizedException('Only SuperAdmins can access this');
    }
    return this.companiesService.getAdminCompanies(query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateCompanyStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { status: string; rejectionReason?: string }
  ) {
    if (req.user.role !== 'SUPERADMIN') {
      throw new UnauthorizedException('Only SuperAdmins can modify company status');
    }
    return this.companiesService.updateCompanyStatus(id, body.status, body.rejectionReason, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/plan')
  updateCompanyPlan(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { plan: string; expiresAt?: string }
  ) {
    if (req.user.role !== 'SUPERADMIN') {
      throw new UnauthorizedException('Only SuperAdmins can modify company plans');
    }
    return this.companiesService.updateCompanyPlan(id, body.plan, body.expiresAt, req.user.id);
  }
}
