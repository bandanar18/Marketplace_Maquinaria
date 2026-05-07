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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const slugify_1 = __importDefault(require("slugify"));
let BrandsService = class BrandsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.brand.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { products: true } } }
        });
    }
    async create(data) {
        const slug = (0, slugify_1.default)(data.name, { lower: true });
        const existing = await this.prisma.brand.findUnique({ where: { slug } });
        if (existing)
            throw new common_1.ConflictException('Brand already exists');
        return this.prisma.brand.create({
            data: {
                ...data,
                slug
            }
        });
    }
    async update(id, data) {
        const updateData = { ...data };
        if (data.name) {
            updateData.slug = (0, slugify_1.default)(data.name, { lower: true });
        }
        return this.prisma.brand.update({
            where: { id },
            data: updateData
        });
    }
    async delete(id) {
        const productsCount = await this.prisma.product.count({ where: { brandId: id } });
        if (productsCount > 0) {
            throw new common_1.ConflictException('Cannot delete brand: it is being used by products');
        }
        return this.prisma.brand.delete({ where: { id } });
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BrandsService);
//# sourceMappingURL=brands.service.js.map