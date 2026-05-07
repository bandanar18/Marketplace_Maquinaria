import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(userId: string, action: string, entity: string, entityId: string, metadata?: any) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        metadata
      }
    });
  }

  async getLogs(query: { page?: string; limit?: string }) {
    const page  = query.page  ? parseInt(query.page,  10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 50;
    const skip  = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        include: {
          user: { select: { firstName: true, lastName: true, email: true, role: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
