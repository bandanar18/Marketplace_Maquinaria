import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(companyId: string | null, userRole: string | null, dto: CreateProductDto) {
    if (!companyId || (userRole !== 'OWNER' && userRole !== 'COMPANY_MEMBER' && userRole !== 'ADMIN')) {
      throw new UnauthorizedException('Insufficient permissions to create product');
    }

    // Convert product title to slug
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
        status: 'PENDING_REVIEW', // Requiere aprobación del admin
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

  async getProducts(query?: {
    categoryId?: string;
    categoryIds?: string[];
    brand?: string;
    minPrice?: number | string;
    maxPrice?: number | string;
    search?: string;
    companyId?: string;
    status?: ProductStatus;
    page?: number | string;
    limit?: number | string;
    type?: 'sale' | 'rent';
    availability?: string;
    verifiedOnly?: string | boolean;
    sortBy?: string;
  }) {
    const { categoryId, categoryIds, brand, minPrice, maxPrice, search, companyId, status, type, availability, verifiedOnly } = query || {};
    const page = query?.page ? parseInt(query.page.toString()) : 1;
    const limit = query?.limit ? parseInt(query.limit.toString()) : 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    // Si no es una búsqueda de inventario (companyId), solo mostrar activos
    if (!companyId) {
      where.status = 'ACTIVE';
    } else {
      where.companyId = companyId;
      if (status) where.status = status;
    }

    if (categoryId) where.categoryId = categoryId;
    if (categoryIds) {
      const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
      where.categoryId = { in: ids };
    }
    
    if (brand) where.brand = { contains: brand, mode: 'insensitive' };
    
    if (availability) where.availability = availability;
    
    if (verifiedOnly === 'true' || verifiedOnly === true) {
      where.company = { verifiedAt: { not: null } };
    }

    // Type filter for sale/rent
    const typeOr: any[] = [];
    if (type === 'sale') {
      typeOr.push(
        { transactionType: 'SALE' },
        { transactionType: 'BOTH' }
      );
    } else if (type === 'rent') {
      typeOr.push(
        { transactionType: 'RENTAL' },
        { transactionType: 'BOTH' }
      );
    }
    
    // Price filter - for rentals use pricePerDay as reference
    const priceField = type === 'rent' ? 'pricePerDay' : 'price';
    if (minPrice || maxPrice) {
      where[priceField] = {};
      if (minPrice) where[priceField].gte = typeof minPrice === 'string' ? parseFloat(minPrice) : minPrice;
      if (maxPrice) where[priceField].lte = typeof maxPrice === 'string' ? parseFloat(maxPrice) : maxPrice;
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
      } else {
        where.OR = searchOr;
      }
    } else if (typeOr.length > 0) {
      where.OR = typeOr;
    }

    const sortBy = query?.sortBy || 'recommended';
    let orderBy: any = { createdAt: 'desc' };
    
    if (sortBy === 'price_asc') orderBy = { [priceField]: 'asc' };
    if (sortBy === 'price_desc') orderBy = { [priceField]: 'desc' };
    if (sortBy === 'rating') orderBy = { createdAt: 'desc' }; // Placeholder for rating

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

  async getProductBySlug(slug: string) {
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
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getProductById(id: string) {
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
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(id: string, companyId: string, dto: any) {
    console.log('--- BACKEND: updateProduct REACHED ---');
    console.log('PRODUCT_ID:', id);
    console.log('COMPANY_ID_FROM_REQ:', companyId);
    
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    
    console.log('PRODUCT_COMPANY_ID:', product.companyId);
    if (product.companyId !== companyId) throw new UnauthorizedException('Not authorized to edit this product');

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
            create: images.map((url: string, index: number) => ({ url, order: index }))
          } : undefined
        },
        include: {
          images: true
        }
      });
      console.log('--- BACKEND: updateProduct SUCCESS ---');
      return updatedProduct;
    } catch (error) {
      console.error('--- BACKEND: updateProduct ERROR ---', error);
      throw error;
    }
  }

  async getAdminProducts(query: { search?: string; status?: string; page?: string; limit?: string }) {
    const page  = query.page  ? parseInt(query.page,  10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 20;
    const skip  = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
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

  async updateProductStatus(id: string, status: any, rejectionReason?: string) {
    return this.prisma.product.update({
      where: { id },
      data: { 
        status,
        rejectionReason: rejectionReason || null,
        publishedAt: status === 'ACTIVE' ? new Date() : undefined,
      },
    });
  }

  async toggleFeatured(id: string, companyId: string) {
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
}
