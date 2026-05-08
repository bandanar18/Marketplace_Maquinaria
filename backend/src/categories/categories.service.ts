import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategoryTree() {
    // Fetch all categories
    const categories = await this.prisma.category.findMany({
      orderBy: { order: 'asc' },
    });

    // Build the tree (max 3 levels according to rules)
    const categoryMap = new Map<string, any>();
    const roots: any[] = [];

    // Initialize map
    categories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Build tree
    categories.forEach(cat => {
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push(categoryMap.get(cat.id));
        }
      } else {
        roots.push(categoryMap.get(cat.id));
      }
    });

    return roots;
  }

  async createCategory(dto: any) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if slug already exists
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new Error(`La categoría con el nombre "${dto.name}" ya existe.`);
    }

    return this.prisma.category.create({
      data: {
        ...dto,
        slug
      }
    });
  }

  async updateCategory(id: string, dto: any) {
    if (dto.name) {
      const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Check if slug exists in another category
      const existing = await this.prisma.category.findFirst({ 
        where: { slug, id: { not: id } } 
      });
      if (existing) {
        throw new Error(`Ya existe otra categoría con el nombre "${dto.name}".`);
      }
      
      dto.slug = slug;
    }
    return this.prisma.category.update({
      where: { id },
      data: dto
    });
  }

  async deleteCategory(id: string) {
    // Check if it has children or products
    const childrenCount = await this.prisma.category.count({ where: { parentId: id } });
    if (childrenCount > 0) throw new Error('Cannot delete category with children');
    
    return this.prisma.category.delete({ where: { id } });
  }
}
