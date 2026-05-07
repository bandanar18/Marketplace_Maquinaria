import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  // Tickets
  async getTickets() {
    return this.prisma.supportTicket.findMany({
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateTicketStatus(id: string, status: any) {
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status }
    });
  }

  // Broadcasts
  async getBroadcasts() {
    return this.prisma.broadcast.findMany({
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createBroadcast(adminId: string, data: { title: string; message: string; target: string }) {
    // 1. Create broadcast record
    const broadcast = await this.prisma.broadcast.create({
      data: {
        userId: adminId,
        title: data.title,
        message: data.message,
        target: data.target
      }
    });

    // 2. Create notifications for all target users
    let users: { id: string }[] = [];
    if (data.target === 'ALL') {
      users = await this.prisma.user.findMany({ select: { id: true } });
    } else if (data.target === 'COMPANIES') {
      users = await this.prisma.user.findMany({ where: { role: 'COMPANY_MEMBER' }, select: { id: true } });
    } else if (data.target === 'CLIENTS') {
      users = await this.prisma.user.findMany({ where: { role: 'CLIENT' }, select: { id: true } });
    }

    const notifications = users.map(u => ({
      userId: u.id,
      title: data.title,
      message: data.message
    }));

    if (notifications.length > 0) {
      await this.prisma.notification.createMany({ data: notifications });
    }

    return broadcast;
  }
}
