import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getMyCompany(companyId: string | null) {
    if (!companyId) {
      throw new UnauthorizedException('User does not belong to a company');
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
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async updateMyCompany(companyId: string | null, userId: string, dto: UpdateCompanyDto) {
    console.log('UPDATING COMPANY:', companyId, 'DTO:', dto);
    if (!companyId) {
      throw new UnauthorizedException('User does not belong to a company');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.companyRole !== 'OWNER' && user?.companyRole !== 'ADMIN') {
      throw new UnauthorizedException('Insufficient permissions to update company profile');
    }

    const { gallery, ...updateData } = dto;

    // Use transaction to ensure both updates succeed
    return this.prisma.$transaction(async (tx) => {
      // 1. Update basic data
      const company = await tx.company.update({
        where: { id: companyId },
        data: updateData,
      });

      // 2. Handle gallery if provided
      if (gallery) {
        // Simple approach: delete all and recreate (suitable for small galleries)
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

  async getCompanyBySlug(slug: string) {
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

    if (!company) throw new NotFoundException('Company not found');
    if (company.status !== 'ACTIVE') throw new NotFoundException('Company not found');

    return company;
  }

  async getCompanyProducts(
    slug: string,
    query: {
      categoryId?: string;
      search?: string;
      sort?: string;
      minPrice?: string;
      maxPrice?: string;
      type?: string;
      page?: string;
      limit?: string;
    },
  ) {
    const company = await this.prisma.company.findUnique({
      where: { slug },
      select: { id: true, status: true },
    });

    if (!company || company.status !== 'ACTIVE') {
      throw new NotFoundException('Company not found');
    }

    const page  = query.page  ? parseInt(query.page,  10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 20;
    const skip  = (page - 1) * limit;

    const where: any = {
      companyId: company.id,
      status: 'ACTIVE',
    };

    if (query.categoryId) where.categoryId = query.categoryId;

    if (query.search) {
      where.OR = [
        { title:       { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { brand:       { contains: query.search, mode: 'insensitive' } },
        { model:       { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.type === 'sale') {
      where.transactionType = { in: ['SALE', 'BOTH'] };
    } else if (query.type === 'rent') {
      where.transactionType = { in: ['RENTAL', 'BOTH'] };
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
      if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
    }

    let orderBy: any = { createdAt: 'desc' };
    if (query.sort === 'price_asc')  orderBy = { price: 'asc'  };
    if (query.sort === 'price_desc') orderBy = { price: 'desc' };
    if (query.sort === 'oldest')     orderBy = { createdAt: 'asc' };
    if (query.sort === 'views')      orderBy = { viewsCount: 'desc' };

    const [items, total, categories] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images:   { orderBy: { order: 'asc' }, take: 1 },
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
      // Distinct categories this company actually has active products in
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

  async getCompanyStats(companyId: string | null) {
    if (!companyId) throw new UnauthorizedException('No company ID');

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
    const statusDistribution = products.reduce((acc: any, p) => {
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

  async getCompanyCustomers(companyId: string) {
    const quotes = await (this.prisma.quote as any).findMany({
      where: { companyId },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true, // It was phoneNumber in my include, but the schema has phone
            avatarUrl: true,
            createdAt: true
          }
        },
        product: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    }) as any[];

    const customersMap = new Map();

    quotes.forEach(quote => {
      if (!quote.client) return;
      
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
      interests: Array.from(c.interests).slice(0, 3) // Top 3 interests
    }));
  }

  async getAllCompanies(query: { search?: string; page?: string; limit?: string }) {
    const page  = query.page  ? parseInt(query.page,  10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 20;
    const skip  = (page - 1) * limit;

    const where: any = {
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

  async getAdminCompanies(query: { search?: string; status?: string; page?: string; limit?: string }) {
    const page  = query.page  ? parseInt(query.page,  10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 20;
    const skip  = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
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

  async updateCompanyStatus(companyId: string, status: any, rejectionReason?: string, adminId?: string) {
    const data: any = { status };
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
  async updateCompanyPlan(companyId: string, plan: any, expiresAt?: string, adminId?: string) {
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

  // --- Team Management ---
  async getCompanyMembers(companyId: string) {
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

  async getCompanyInvites(companyId: string) {
    return this.prisma.companyInvite.findMany({
      where: { companyId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    });
  }

  async inviteMember(companyId: string, email: string, role: any) {
    // 1. Check if user is already a member
    const existingMember = await this.prisma.user.findUnique({ where: { email } });
    if (existingMember?.companyId === companyId) {
      throw new Error('User is already a member of this company');
    }

    // 2. Generate token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

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

  async cancelInvite(inviteId: string, companyId: string) {
    return this.prisma.companyInvite.update({
      where: { id: inviteId, companyId },
      data: { status: 'CANCELLED' }
    });
  }

  async removeMember(companyId: string, userId: string, requesterId: string) {
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

  async importInventory(companyId: string, csvData: string) {
    const { parse } = require('csv-parse/sync');
    let records;
    try {
      records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
    } catch (e) {
      throw new Error('Invalid CSV format');
    }

    const categories = await this.prisma.category.findMany();
    const results = {
      success: 0,
      errors: [] as string[]
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

        // Find category by name (case insensitive)
        const category = categories.find(c => c.name.toLowerCase() === record.category?.toLowerCase());
        if (!category) throw new Error(`Category not found: ${record.category}`);

        // Generate slug
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
            condition: (record.condition as any) || 'USED',
            availability: (record.availability as any) || 'IN_STOCK',
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
      } catch (e: any) {
        results.errors.push(`Row ${index + 2}: ${e.message}`);
      }
    }

    return results;
  }
}
