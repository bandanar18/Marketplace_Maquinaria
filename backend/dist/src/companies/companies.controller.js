"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesController = void 0;
const common_1 = require("@nestjs/common");
const companies_service_1 = require("./companies.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const update_company_dto_1 = require("./dto/update-company.dto");
let CompaniesController = class CompaniesController {
    companiesService;
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    getAllCompanies(query) {
        return this.companiesService.getAllCompanies(query);
    }
    getMyCompany(req) {
        return this.companiesService.getMyCompany(req.user.companyId);
    }
    updateMyCompany(req, updateCompanyDto) {
        return this.companiesService.updateMyCompany(req.user.companyId, req.user.id, updateCompanyDto);
    }
    getCompanyStats(req) {
        return this.companiesService.getCompanyStats(req.user.companyId);
    }
    getMyCompanyCustomers(req) {
        if (!req.user.companyId)
            throw new common_1.UnauthorizedException('No company associated');
        return this.companiesService.getCompanyCustomers(req.user.companyId);
    }
    getMembers(req) {
        if (!req.user.companyId)
            throw new common_1.UnauthorizedException();
        return this.companiesService.getCompanyMembers(req.user.companyId);
    }
    getInvites(req) {
        if (!req.user.companyId)
            throw new common_1.UnauthorizedException();
        return this.companiesService.getCompanyInvites(req.user.companyId);
    }
    invite(req, body) {
        if (!req.user.companyId || req.user.companyRole === 'MEMBER')
            throw new common_1.UnauthorizedException();
        return this.companiesService.inviteMember(req.user.companyId, body.email, body.role);
    }
    cancelInvite(req, id) {
        if (!req.user.companyId || req.user.companyRole === 'MEMBER')
            throw new common_1.UnauthorizedException();
        return this.companiesService.cancelInvite(id, req.user.companyId);
    }
    removeMember(req, id) {
        if (!req.user.companyId || req.user.companyRole !== 'OWNER')
            throw new common_1.UnauthorizedException();
        return this.companiesService.removeMember(req.user.companyId, id, req.user.id);
    }
    importInventory(req, body) {
        if (!req.user.companyId)
            throw new common_1.UnauthorizedException();
        return this.companiesService.importInventory(req.user.companyId, body.csvData);
    }
    getCompanyBySlug(slug) {
        return this.companiesService.getCompanyBySlug(slug);
    }
    getCompanyProducts(slug, query) {
        return this.companiesService.getCompanyProducts(slug, query);
    }
    getAdminCompanies(req, query) {
        if (req.user.role !== 'SUPERADMIN') {
            throw new common_1.UnauthorizedException('Only SuperAdmins can access this');
        }
        return this.companiesService.getAdminCompanies(query);
    }
    updateCompanyStatus(req, id, body) {
        if (req.user.role !== 'SUPERADMIN') {
            throw new common_1.UnauthorizedException('Only SuperAdmins can modify company status');
        }
        return this.companiesService.updateCompanyStatus(id, body.status, body.rejectionReason, req.user.id);
    }
    updateCompanyPlan(req, id, body) {
        if (req.user.role !== 'SUPERADMIN') {
            throw new common_1.UnauthorizedException('Only SuperAdmins can modify company plans');
        }
        return this.companiesService.updateCompanyPlan(id, body.plan, body.expiresAt, req.user.id);
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getAllCompanies", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getMyCompany", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('me'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_company_dto_1.UpdateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "updateMyCompany", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getCompanyStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my/customers'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getMyCompanyCustomers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my/members'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getMembers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my/invites'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getInvites", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('my/invites'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "invite", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('my/invites/:id/cancel'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "cancelInvite", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('my/members/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "removeMember", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('my/inventory/import'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "importInventory", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getCompanyBySlug", null);
__decorate([
    (0, common_1.Get)(':slug/products'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getCompanyProducts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/list'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getAdminCompanies", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "updateCompanyStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/plan'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "updateCompanyPlan", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, common_1.Controller)('companies'),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesController);
//# sourceMappingURL=companies.controller.js.map