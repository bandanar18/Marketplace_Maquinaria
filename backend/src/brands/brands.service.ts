import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } }
    });
  }

  async create(data: { name: string; logoUrl?: string }) {
    const slug = slugify(data.name, { lower: true });
    
    const existing = await this.prisma.brand.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Brand already exists');

    return this.prisma.brand.create({
      data: {
        ...data,
        slug
      }
    });
  }

  async update(id: string, data: { name?: string; logoUrl?: string }) {
    const updateData: any = { ...data };
    if (data.name) {
      updateData.slug = slugify(data.name, { lower: true });
    }

    return this.prisma.brand.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: string) {
    // Check if brand is in use
    const productsCount = await this.prisma.product.count({ where: { brandId: id } });
    if (productsCount > 0) {
      throw new ConflictException('Cannot delete brand: it is being used by products');
    }

    return this.prisma.brand.delete({ where: { id } });
  }
}
