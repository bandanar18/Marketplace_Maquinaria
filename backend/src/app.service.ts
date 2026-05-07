import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAdminStats() {
    const [pendingCompanies, pendingProducts, totalUsers] = await Promise.all([
      this.prisma.company.count({ where: { status: 'PENDING_REVIEW' } }),
      this.prisma.product.count({ where: { status: 'PENDING_REVIEW' } }),
      this.prisma.user.count(),
    ]);

    return {
      pendingCompanies,
      pendingProducts,
      totalUsers,
    };
  }
}
