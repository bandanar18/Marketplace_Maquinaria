import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getReports(query: { page?: string; limit?: string }) {
    const page  = query.page  ? parseInt(query.page,  10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 20;
    const skip  = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.report.findMany({
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              company: { select: { name: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count(),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async deleteReport(id: string) {
    return this.prisma.report.delete({ where: { id } });
  }
}
