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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategoryTree() {
        const categories = await this.prisma.category.findMany({
            orderBy: { order: 'asc' },
        });
        const categoryMap = new Map();
        const roots = [];
        categories.forEach(cat => {
            categoryMap.set(cat.id, { ...cat, children: [] });
        });
        categories.forEach(cat => {
            if (cat.parentId) {
                const parent = categoryMap.get(cat.parentId);
                if (parent) {
                    parent.children.push(categoryMap.get(cat.id));
                }
            }
            else {
                roots.push(categoryMap.get(cat.id));
            }
        });
        return roots;
    }
    async createCategory(dto) {
        const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return this.prisma.category.create({
            data: {
                ...dto,
                slug
            }
        });
    }
    async updateCategory(id, dto) {
        if (dto.name) {
            dto.slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        return this.prisma.category.update({
            where: { id },
            data: dto
        });
    }
    async deleteCategory(id) {
        const childrenCount = await this.prisma.category.count({ where: { parentId: id } });
        if (childrenCount > 0)
            throw new Error('Cannot delete category with children');
        return this.prisma.category.delete({ where: { id } });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map