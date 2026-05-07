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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProduct(companyId, userRole, dto) {
        if (!companyId || (userRole !== 'OWNER' && userRole !== 'COMPANY_MEMBER' && userRole !== 'ADMIN')) {
            throw new common_1.UnauthorizedException('Insufficient permissions to create product');
        }
        const baseSlug = dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        let slug = baseSlug;
        let count = 1;
        while (await this.prisma.product.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }
        const { images, ...productData } = dto;
        const product = await this.prisma.product.create({
            data: {
                ...productData,
                price: productData.price ?? 0,
                slug,
                companyId,
                status: 'PENDING_REVIEW',
                images: images ? {
                    create: images.map((url, index) => ({ url, order: index }))
                } : undefined
            },
            include: {
                images: true
            }
        });
        return product;
    }
    async getProducts(query) {
        const { categoryId, categoryIds, brand, minPrice, maxPrice, search, companyId, status, type, availability, verifiedOnly } = query || {};
        const page = query?.page ? parseInt(query.page.toString()) : 1;
        const limit = query?.limit ? parseInt(query.limit.toString()) : 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (!companyId) {
            where.status = 'ACTIVE';
        }
        else {
            where.companyId = companyId;
            if (status)
                where.status = status;
        }
        if (categoryId)
            where.categoryId = categoryId;
        if (categoryIds) {
            const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
            where.categoryId = { in: ids };
        }
        if (brand)
            where.brand = { contains: brand, mode: 'insensitive' };
        if (availability)
            where.availability = availability;
        if (verifiedOnly === 'true' || verifiedOnly === true) {
            where.company = { verifiedAt: { not: null } };
        }
        const typeOr = [];
        if (type === 'sale') {
            typeOr.push({ transactionType: 'SALE' }, { transactionType: 'BOTH' });
        }
        else if (type === 'rent') {
            typeOr.push({ transactionType: 'RENTAL' }, { transactionType: 'BOTH' });
        }
        const priceField = type === 'rent' ? 'pricePerDay' : 'price';
        if (minPrice || maxPrice) {
            where[priceField] = {};
            if (minPrice)
                where[priceField].gte = typeof minPrice === 'string' ? parseFloat(minPrice) : minPrice;
            if (maxPrice)
                where[priceField].lte = typeof maxPrice === 'string' ? parseFloat(maxPrice) : maxPrice;
        }
        if (search) {
            const searchOr = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { brand: { contains: search, mode: 'insensitive' } },
                { model: { contains: search, mode: 'insensitive' } },
            ];
            if (typeOr.length > 0) {
                where.AND = [
                    { OR: typeOr },
                    { OR: searchOr }
                ];
            }
            else {
                where.OR = searchOr;
            }
        }
        else if (typeOr.length > 0) {
            where.OR = typeOr;
        }
        const sortBy = query?.sortBy || 'recommended';
        let orderBy = { createdAt: 'desc' };
        if (sortBy === 'price_asc')
            orderBy = { [priceField]: 'asc' };
        if (sortBy === 'price_desc')
            orderBy = { [priceField]: 'desc' };
        if (sortBy === 'rating')
            orderBy = { createdAt: 'desc' };
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    images: {
                        orderBy: { order: 'asc' },
                        take: 1
                    },
                    company: {
                        select: { id: true, name: true, slug: true }
                    }
                },
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
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
    async getProductBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                images: {
                    orderBy: { order: 'asc' }
                },
                company: {
                    select: { id: true, name: true, slug: true, country: true, city: true, phone: true }
                },
                category: true
            }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: { order: 'asc' }
                },
                category: true
            }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async updateProduct(id, companyId, dto) {
        console.log('--- BACKEND: updateProduct REACHED ---');
        console.log('PRODUCT_ID:', id);
        console.log('COMPANY_ID_FROM_REQ:', companyId);
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        console.log('PRODUCT_COMPANY_ID:', product.companyId);
        if (product.companyId !== companyId)
            throw new common_1.UnauthorizedException('Not authorized to edit this product');
        const { images, ...productData } = dto;
        console.log('IMAGES_RECEIVED:', images);
        console.log('PRODUCT_DATA_TO_UPDATE:', productData);
        try {
            const updatedProduct = await this.prisma.product.update({
                where: { id },
                data: {
                    ...productData,
                    images: images ? {
                        deleteMany: {},
                        create: images.map((url, index) => ({ url, order: index }))
                    } : undefined
                },
                include: {
                    images: true
                }
            });
            console.log('--- BACKEND: updateProduct SUCCESS ---');
            return updatedProduct;
        }
        catch (error) {
            console.error('--- BACKEND: updateProduct ERROR ---', error);
            throw error;
        }
    }
    async getAdminProducts(query) {
        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = query.limit ? parseInt(query.limit, 10) : 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { brand: { contains: query.search, mode: 'insensitive' } },
                { model: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    company: { select: { id: true, name: true, slug: true } },
                    images: { take: 1, orderBy: { order: 'asc' } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            items,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async updateProductStatus(id, status, rejectionReason) {
        return this.prisma.product.update({
            where: { id },
            data: {
                status,
                rejectionReason: rejectionReason || null,
                publishedAt: status === 'ACTIVE' ? new Date() : undefined,
            },
        });
    }
    async toggleFeatured(id, companyId) {
        const product = await this.prisma.product.findUnique({
            where: { id }
        });
        if (!product || product.companyId !== companyId) {
            throw new Error('Producto no encontrado o no pertenece a tu empresa');
        }
        return this.prisma.product.update({
            where: { id },
            data: { featured: !product.featured }
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map