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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SupportService = class SupportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTickets() {
        return this.prisma.supportTicket.findMany({
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateTicketStatus(id, status) {
        return this.prisma.supportTicket.update({
            where: { id },
            data: { status }
        });
    }
    async getBroadcasts() {
        return this.prisma.broadcast.findMany({
            include: { user: { select: { firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async createBroadcast(adminId, data) {
        const broadcast = await this.prisma.broadcast.create({
            data: {
                userId: adminId,
                title: data.title,
                message: data.message,
                target: data.target
            }
        });
        let users = [];
        if (data.target === 'ALL') {
            users = await this.prisma.user.findMany({ select: { id: true } });
        }
        else if (data.target === 'COMPANIES') {
            users = await this.prisma.user.findMany({ where: { role: 'COMPANY_MEMBER' }, select: { id: true } });
        }
        else if (data.target === 'CLIENTS') {
            users = await this.prisma.user.findMany({ where: { role: 'CLIENT' }, select: { id: true } });
        }
        const notifications = users.map(u => ({
            userId: u.id,
            title: data.title,
            message: data.message
        }));
        if (notifications.length > 0) {
            await this.prisma.notification.createMany({ data: notifications });
        }
        return broadcast;
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupportService);
//# sourceMappingURL=support.service.js.map