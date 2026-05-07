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
exports.QuotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuotesService = class QuotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    calculateRentalPrice(product, days) {
        const pricePerDay = product.pricePerDay ? Number(product.pricePerDay) : null;
        const pricePerWeek = product.pricePerWeek ? Number(product.pricePerWeek) : null;
        const pricePerMonth = product.pricePerMonth ? Number(product.pricePerMonth) : null;
        const minRentalDays = product.minRentalDays;
        if (minRentalDays && days < minRentalDays) {
            throw new common_1.BadRequestException(`Minimum rental period is ${minRentalDays} days`);
        }
        let remainingDays = days;
        let total = 0;
        const breakdown = [];
        if (pricePerMonth) {
            const months = Math.floor(remainingDays / 30);
            if (months > 0) {
                total += pricePerMonth * months;
                remainingDays -= months * 30;
                breakdown.push(`${months} mes(es)`);
            }
        }
        if (pricePerWeek && remainingDays >= 7) {
            const weeks = Math.floor(remainingDays / 7);
            total += pricePerWeek * weeks;
            remainingDays -= weeks * 7;
            if (weeks > 0)
                breakdown.push(`${weeks} semana(s)`);
        }
        if (pricePerDay && remainingDays > 0) {
            total += pricePerDay * remainingDays;
            breakdown.push(`${remainingDays} día(s)`);
        }
        return {
            total,
            breakdown: breakdown.join(', ') || `${days} día(s) a $${pricePerDay}/día`
        };
    }
    async checkAvailability(productId, startDate, endDate) {
        const existingBookings = await this.prisma.rentalBooking.findMany({
            where: {
                productId,
                status: { in: ['PENDING', 'CONFIRMED'] },
                OR: [
                    {
                        startDate: { lte: startDate },
                        endDate: { gte: startDate }
                    },
                    {
                        startDate: { lte: endDate },
                        endDate: { gte: endDate }
                    },
                    {
                        startDate: { gte: startDate },
                        endDate: { lte: endDate }
                    }
                ]
            }
        });
        return existingBookings.length === 0;
    }
    async createQuote(clientId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (dto.startDate && dto.endDate) {
            const start = new Date(dto.startDate);
            const end = new Date(dto.endDate);
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const isAvailable = await this.checkAvailability(dto.productId, start, end);
            if (!isAvailable) {
                throw new common_1.BadRequestException('Product is not available for the selected dates');
            }
            if (product.minRentalDays && days < product.minRentalDays) {
                throw new common_1.BadRequestException(`Minimum rental period is ${product.minRentalDays} days`);
            }
        }
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        return this.prisma.quote.create({
            data: {
                clientId,
                companyId: product.companyId,
                productId: product.id,
                message: dto.message,
                quantity: dto.quantity,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                expiresAt,
            },
        });
    }
    async getMyQuotes(userId, role, companyId) {
        if (role === 'CLIENT') {
            return this.prisma.quote.findMany({
                where: { clientId: userId },
                include: {
                    product: { select: { title: true, slug: true } },
                    company: { select: { name: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        else if (companyId) {
            return this.prisma.quote.findMany({
                where: { companyId: companyId },
                include: {
                    product: { select: { title: true, slug: true } },
                    client: { select: { firstName: true, lastName: true, email: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        return [];
    }
    async getQuoteById(id, userId, role, companyId) {
        const quote = await this.prisma.quote.findUnique({
            where: { id },
            include: {
                product: { select: { id: true, title: true, slug: true, price: true, currency: true } },
                client: { select: { id: true, firstName: true, lastName: true, email: true } },
                company: {
                    include: {
                        members: {
                            select: { id: true },
                            take: 1
                        }
                    }
                },
            }
        });
        if (!quote)
            throw new common_1.NotFoundException('Quote not found');
        if (role === 'CLIENT' && quote.clientId !== userId) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        if (role === 'COMPANY_MEMBER' && quote.companyId !== companyId) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        return quote;
    }
    async respondToQuote(id, companyId, userId, dto) {
        const quote = await this.prisma.quote.findUnique({ where: { id } });
        if (!quote)
            throw new common_1.NotFoundException('Quote not found');
        if (quote.companyId !== companyId)
            throw new common_1.UnauthorizedException('Not authorized');
        const updated = await this.prisma.quote.update({
            where: { id },
            data: {
                responseMessage: dto.message,
                status: dto.status,
                responsePrice: dto.price,
                responseAt: new Date(),
            }
        });
        try {
            const thread = await this.prisma.thread.findFirst({ where: { quoteId: id } });
            if (thread) {
                await this.prisma.message.create({
                    data: {
                        threadId: thread.id,
                        senderId: userId,
                        content: `[RESPUESTA OFICIAL]: ${dto.message}${dto.price ? ` - Precio propuesto: ${dto.price}` : ''}`,
                    }
                });
            }
        }
        catch (e) {
            console.error('Error creating auto-message:', e);
        }
        return updated;
    }
};
exports.QuotesService = QuotesService;
exports.QuotesService = QuotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotesService);
//# sourceMappingURL=quotes.service.js.map