import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getGlobalStats() {
    const [
      totalUsers,
      totalCompanies,
      totalProducts,
      totalQuotes,
      activeProducts,
      pendingProducts,
      pendingCompanies,
      topProducts
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.company.count(),
      this.prisma.product.count(),
      this.prisma.quote.count(),
      this.prisma.product.count({ where: { status: 'ACTIVE' } }),
      this.prisma.product.count({ where: { status: 'PENDING_REVIEW' } }),
      this.prisma.company.count({ where: { status: 'PENDING_REVIEW' } }),
      this.prisma.product.findMany({
        take: 5,
        orderBy: { viewsCount: 'desc' },
        select: {
          id: true,
          title: true,
          viewsCount: true,
          company: { select: { name: true } }
        }
      })
    ]);

    // Simplified daily growth (mocking some data for the last 7 days since we might not have enough history)
    // In a real app, we would query the database with date ranges
    const dailyStats = [
      { date: 'Lun', quotes: 12, products: 5 },
      { date: 'Mar', quotes: 19, products: 8 },
      { date: 'Mie', quotes: 15, products: 12 },
      { date: 'Jue', quotes: 22, products: 10 },
      { date: 'Vie', quotes: 30, products: 15 },
      { date: 'Sab', quotes: 25, products: 7 },
      { date: 'Dom', quotes: 18, products: 4 },
    ];

    return {
      overview: {
        totalUsers,
        totalCompanies,
        totalProducts,
        totalQuotes,
        activeProducts,
        pendingProducts,
        pendingCompanies,
      },
      topProducts,
      dailyStats
    };
  }

  async exportToCsv(entity: string) {
    let csv = '';
    
    if (entity === 'users') {
      const data = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
      csv = 'ID,Nombre,Apellido,Email,Rol,Estado,Registro\n';
      data.forEach(u => {
        csv += `${u.id},${u.firstName},${u.lastName},${u.email},${u.role},${u.status},${u.createdAt.toISOString()}\n`;
      });
    } else if (entity === 'companies') {
      const data = await this.prisma.company.findMany({ orderBy: { createdAt: 'desc' } });
      csv = 'ID,Nombre,RIF,Email,Ciudad,Estado,Plan,Registro\n';
      data.forEach(c => {
        csv += `${c.id},"${c.name}",${c.taxId},${c.email},${c.city},${c.status},${c.plan},${c.createdAt.toISOString()}\n`;
      });
    } else if (entity === 'products') {
      const data = await this.prisma.product.findMany({ 
        include: { company: true, category: true },
        orderBy: { createdAt: 'desc' } 
      });
      csv = 'ID,Titulo,Marca,Modelo,Precio,Empresa,Categoria,Estado,Vistas\n';
      data.forEach(p => {
        csv += `${p.id},"${p.title}",${p.brand},${p.model},${p.price},"${p.company.name}","${p.category.name}",${p.status},${p.viewsCount}\n`;
      });
    }

    return { csv };
  }
}
