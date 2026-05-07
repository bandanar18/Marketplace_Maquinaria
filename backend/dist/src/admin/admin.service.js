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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGlobalStats() {
        const [totalUsers, totalCompanies, totalProducts, totalQuotes, activeProducts, pendingProducts, pendingCompanies, topProducts] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.company.count(),
            this.prisma.product.count(),
            this.prisma.quote.count(),
            this.prisma.product.count({ where: { status: 'ACTIVE' } }),
            this.prisma.product.count({ where: { status: 'PENDING_REVIEW' } }),
            this.prisma.company.count({ where: { status: 'PENDING_REVIEW' } }),
            this.prisma.product.findMany({
                take: 5,
                orderBy: { viewsCount: 'desc' },
                select: {
                    id: true,
                    title: true,
                    viewsCount: true,
                    company: { select: { name: true } }
                }
            })
        ]);
        const dailyStats = [
            { date: 'Lun', quotes: 12, products: 5 },
            { date: 'Mar', quotes: 19, products: 8 },
            { date: 'Mie', quotes: 15, products: 12 },
            { date: 'Jue', quotes: 22, products: 10 },
            { date: 'Vie', quotes: 30, products: 15 },
            { date: 'Sab', quotes: 25, products: 7 },
            { date: 'Dom', quotes: 18, products: 4 },
        ];
        return {
            overview: {
                totalUsers,
                totalCompanies,
                totalProducts,
                totalQuotes,
                activeProducts,
                pendingProducts,
                pendingCompanies,
            },
            topProducts,
            dailyStats
        };
    }
    async exportToCsv(entity) {
        let csv = '';
        if (entity === 'users') {
            const data = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
            csv = 'ID,Nombre,Apellido,Email,Rol,Estado,Registro\n';
            data.forEach(u => {
                csv += `${u.id},${u.firstName},${u.lastName},${u.email},${u.role},${u.status},${u.createdAt.toISOString()}\n`;
            });
        }
        else if (entity === 'companies') {
            const data = await this.prisma.company.findMany({ orderBy: { createdAt: 'desc' } });
            csv = 'ID,Nombre,RIF,Email,Ciudad,Estado,Plan,Registro\n';
            data.forEach(c => {
                csv += `${c.id},"${c.name}",${c.taxId},${c.email},${c.city},${c.status},${c.plan},${c.createdAt.toISOString()}\n`;
            });
        }
        else if (entity === 'products') {
            const data = await this.prisma.product.findMany({
                include: { company: true, category: true },
                orderBy: { createdAt: 'desc' }
            });
            csv = 'ID,Titulo,Marca,Modelo,Precio,Empresa,Categoria,Estado,Vistas\n';
            data.forEach(p => {
                csv += `${p.id},"${p.title}",${p.brand},${p.model},${p.price},"${p.company.name}","${p.category.name}",${p.status},${p.viewsCount}\n`;
            });
        }
        return { csv };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map