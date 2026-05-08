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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let CompaniesService = class CompaniesService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async getMyCompany(companyId) {
        if (!companyId) {
            throw new common_1.UnauthorizedException('User does not belong to a company');
        }
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            include: {
                members: {
                    select: { id: true, firstName: true, lastName: true, role: true, companyRole: true }
                },
                images: {
                    orderBy: { order: 'asc' }
                }
            }
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        return company;
    }
    async updateMyCompany(companyId, userId, dto) {
        console.log('UPDATING COMPANY:', companyId, 'DTO:', dto);
        if (!companyId) {
            throw new common_1.UnauthorizedException('User does not belong to a company');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user?.companyRole !== 'OWNER' && user?.companyRole !== 'ADMIN') {
            throw new common_1.UnauthorizedException('Insufficient permissions to update company profile');
        }
        const { gallery, ...updateData } = dto;
        return this.prisma.$transaction(async (tx) => {
            const company = await tx.company.update({
                where: { id: companyId },
                data: updateData,
            });
            if (gallery) {
                await tx.companyImage.deleteMany({
                    where: { companyId }
                });
                if (gallery.length > 0) {
                    await tx.companyImage.createMany({
                        data: gallery.map((url, index) => ({
                            companyId,
                            url,
                            order: index
                        }))
                    });
                }
            }
            return company;
        });
    }
    async getCompanyBySlug(slug) {
        const company = await this.prisma.company.findUnique({
            where: { slug },
            select: {
                id: true,
                slug: true,
                name: true,
                logoUrl: true,
                description: true,
                website: true,
                phone: true,
                email: true,
                country: true,
                city: true,
                address: true,
                status: true,
                plan: true,
                verifiedAt: true,
                createdAt: true,
                _count: {
                    select: {
                        products: { where: { status: 'ACTIVE' } },
                        reviews: true,
                    },
                },
            },
        });
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        if (company.status !== 'ACTIVE')
            throw new common_1.NotFoundException('Company not found');
        return company;
    }
    async getCompanyProducts(slug, query) {
        const company = await this.prisma.company.findUnique({
            where: { slug },
            select: { id: true, status: true },
        });
        if (!company || company.status !== 'ACTIVE') {
            throw new common_1.NotFoundException('Company not found');
        }
        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = query.limit ? parseInt(query.limit, 10) : 20;
        const skip = (page - 1) * limit;
        const where = {
            companyId: company.id,
            status: 'ACTIVE',
        };
        if (query.categoryId)
            where.categoryId = query.categoryId;
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
                { brand: { contains: query.search, mode: 'insensitive' } },
                { model: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query.type === 'sale') {
            where.transactionType = { in: ['SALE', 'BOTH'] };
        }
        else if (query.type === 'rent') {
            where.transactionType = { in: ['RENTAL', 'BOTH'] };
        }
        if (query.minPrice || query.maxPrice) {
            where.price = {};
            if (query.minPrice)
                where.price.gte = parseFloat(query.minPrice);
            if (query.maxPrice)
                where.price.lte = parseFloat(query.maxPrice);
        }
        let orderBy = { createdAt: 'desc' };
        if (query.sort === 'price_asc')
            orderBy = { price: 'asc' };
        if (query.sort === 'price_desc')
            orderBy = { price: 'desc' };
        if (query.sort === 'oldest')
            orderBy = { createdAt: 'asc' };
        if (query.sort === 'views')
            orderBy = { viewsCount: 'desc' };
        const [items, total, categories] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    images: { orderBy: { order: 'asc' }, take: 1 },
                    category: { select: { id: true, name: true, slug: true } },
                },
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
            this.prisma.category.findMany({
                where: {
                    products: {
                        some: { companyId: company.id, status: 'ACTIVE' },
                    },
                },
                select: { id: true, name: true, slug: true },
                orderBy: { name: 'asc' },
            }),
        ]);
        return {
            items,
            categories,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getCompanyStats(companyId) {
        if (!companyId)
            throw new common_1.UnauthorizedException('No company ID');
        const [activeProducts, totalQuotes, products, topProducts] = await Promise.all([
            this.prisma.product.count({ where: { companyId, status: 'ACTIVE' } }),
            this.prisma.quote.count({ where: { companyId } }),
            this.prisma.product.findMany({
                where: { companyId },
                select: { viewsCount: true, status: true }
            }),
            this.prisma.product.findMany({
                where: { companyId, status: 'ACTIVE' },
                orderBy: { viewsCount: 'desc' },
                take: 5,
                select: { id: true, title: true, viewsCount: true, price: true, currency: true }
            })
        ]);
        const totalViews = products.reduce((acc, p) => acc + p.viewsCount, 0);
        const statusDistribution = products.reduce((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {});
        const totalMessages = await this.prisma.thread.count({
            where: {
                OR: [
                    { product: { companyId } },
                    { quote: { companyId } }
                ]
            }
        });
        return {
            activeProducts,
            totalQuotes,
            totalViews,
            totalMessages,
            topProducts,
            statusDistribution,
        };
    }
    async getCompanyCustomers(companyId) {
        const quotes = await this.prisma.quote.findMany({
            where: { companyId },
            include: {
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        avatarUrl: true,
                        createdAt: true
                    }
                },
                product: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        const customersMap = new Map();
        quotes.forEach(quote => {
            if (!quote.client)
                return;
            const clientId = quote.client.id;
            if (!customersMap.has(clientId)) {
                customersMap.set(clientId, {
                    id: quote.client.id,
                    firstName: quote.client.firstName,
                    lastName: quote.client.lastName,
                    email: quote.client.email,
                    phone: quote.client.phone,
                    avatarUrl: quote.client.avatarUrl,
                    createdAt: quote.client.createdAt,
                    totalQuotes: 0,
                    lastInteraction: quote.createdAt,
                    interests: new Set()
                });
            }
            const customer = customersMap.get(clientId);
            customer.totalQuotes += 1;
            if (quote.createdAt > customer.lastInteraction) {
                customer.lastInteraction = quote.createdAt;
            }
            if (quote.product && quote.product.title) {
                customer.interests.add(quote.product.title);
            }
        });
        return Array.from(customersMap.values()).map(c => ({
            ...c,
            interests: Array.from(c.interests).slice(0, 3)
        }));
    }
    async getAllCompanies(query) {
        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = query.limit ? parseInt(query.limit, 10) : 20;
        const skip = (page - 1) * limit;
        const where = {
            status: 'ACTIVE',
        };
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
                { city: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            this.prisma.company.findMany({
                where,
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    logoUrl: true,
                    coverUrl: true,
                    description: true,
                    city: true,
                    country: true,
                    openingHours: true,
                    verifiedAt: true,
                    _count: {
                        select: {
                            products: { where: { status: 'ACTIVE' } },
                            reviews: true,
                        },
                    },
                },
                orderBy: { name: 'asc' },
                skip,
                take: limit,
            }),
            this.prisma.company.count({ where }),
        ]);
        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getAdminCompanies(query) {
        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = query.limit ? parseInt(query.limit, 10) : 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { taxId: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            this.prisma.company.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.company.count({ where }),
        ]);
        return {
            items,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async updateCompanyStatus(companyId, status, rejectionReason, adminId) {
        const data = { status };
        if (status === 'ACTIVE') {
            data.verifiedAt = new Date();
        }
        if (rejectionReason) {
            data.rejectionReason = rejectionReason;
        }
        const company = await this.prisma.company.update({
            where: { id: companyId },
            data,
        });
        if (adminId) {
            await this.audit.log(adminId, 'UPDATE_COMPANY_STATUS', 'Company', companyId, { status, rejectionReason });
        }
        return company;
    }
    async updateCompanyPlan(companyId, plan, expiresAt, adminId) {
        const company = await this.prisma.company.update({
            where: { id: companyId },
            data: {
                plan,
                planExpiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        });
        if (adminId) {
            await this.audit.log(adminId, 'UPDATE_COMPANY_PLAN', 'Company', companyId, { plan, expiresAt });
        }
        return company;
    }
    async getCompanyMembers(companyId) {
        return this.prisma.user.findMany({
            where: { companyId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                companyRole: true,
                avatarUrl: true,
                createdAt: true
            },
            orderBy: { companyRole: 'asc' }
        });
    }
    async getCompanyInvites(companyId) {
        return this.prisma.companyInvite.findMany({
            where: { companyId, status: 'PENDING' },
            orderBy: { createdAt: 'desc' }
        });
    }
    async inviteMember(companyId, email, role) {
        const existingMember = await this.prisma.user.findUnique({ where: { email } });
        if (existingMember?.companyId === companyId) {
            throw new Error('User is already a member of this company');
        }
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        return this.prisma.companyInvite.create({
            data: {
                email,
                companyId,
                role,
                token,
                expiresAt
            }
        });
    }
    async cancelInvite(inviteId, companyId) {
        return this.prisma.companyInvite.update({
            where: { id: inviteId, companyId },
            data: { status: 'CANCELLED' }
        });
    }
    async removeMember(companyId, userId, requesterId) {
        const member = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!member || member.companyId !== companyId) {
            throw new Error('Member not found or not in this company');
        }
        if (member.companyRole === 'OWNER') {
            throw new Error('Cannot remove the owner of the company');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { companyId: null, companyRole: null }
        });
    }
    async importInventory(companyId, csvData) {
        const { parse } = require('csv-parse/sync');
        let records;
        try {
            records = parse(csvData, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            });
        }
        catch (e) {
            throw new Error('Invalid CSV format');
        }
        const categories = await this.prisma.category.findMany();
        const results = {
            success: 0,
            errors: []
        };
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            select: { country: true, city: true }
        });
        for (const [index, record] of records.entries()) {
            try {
                if (!record.title || !record.category) {
                    throw new Error('Missing required fields: title or category');
                }
                const category = categories.find(c => c.name.toLowerCase() === record.category?.toLowerCase());
                if (!category)
                    throw new Error(`Category not found: ${record.category}`);
                const baseSlug = record.title.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
                await this.prisma.product.create({
                    data: {
                        title: record.title,
                        slug,
                        description: record.description || '',
                        price: record.price ? parseFloat(record.price.toString().replace(/[$,]/g, '')) : 0,
                        currency: record.currency || 'USD',
                        brand: record.brand || '',
                        model: record.model || '',
                        year: record.year ? parseInt(record.year.toString()) : new Date().getFullYear(),
                        condition: record.condition || 'USED',
                        availability: record.availability || 'IN_STOCK',
                        status: 'PENDING_REVIEW',
                        categoryId: category.id,
                        companyId: companyId,
                        country: company?.country || 'Venezuela',
                        city: company?.city || 'Caracas',
                        featured: false,
                        viewsCount: 0
                    }
                });
                results.success++;
            }
            catch (e) {
                results.errors.push(`Row ${index + 2}: ${e.message}`);
            }
        }
        return results;
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map