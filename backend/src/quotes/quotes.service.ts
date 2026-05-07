import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  calculateRentalPrice(product: any, days: number): { total: number; breakdown: string } {
    const pricePerDay = product.pricePerDay ? Number(product.pricePerDay) : null;
    const pricePerWeek = product.pricePerWeek ? Number(product.pricePerWeek) : null;
    const pricePerMonth = product.pricePerMonth ? Number(product.pricePerMonth) : null;
    const minRentalDays = product.minRentalDays;
    
    if (minRentalDays && days < minRentalDays) {
      throw new BadRequestException(`Minimum rental period is ${minRentalDays} days`);
    }

    // Calculate best price combination
    let remainingDays = days;
    let total = 0;
    const breakdown: string[] = [];

    // Use months first (cheapest per day)
    if (pricePerMonth) {
      const months = Math.floor(remainingDays / 30);
      if (months > 0) {
        total += pricePerMonth * months;
        remainingDays -= months * 30;
        breakdown.push(`${months} mes(es)`);
      }
    }

    // Use weeks
    if (pricePerWeek && remainingDays >= 7) {
      const weeks = Math.floor(remainingDays / 7);
      total += pricePerWeek * weeks;
      remainingDays -= weeks * 7;
      if (weeks > 0) breakdown.push(`${weeks} semana(s)`);
    }

    // Use remaining days
    if (pricePerDay && remainingDays > 0) {
      total += pricePerDay * remainingDays;
      breakdown.push(`${remainingDays} día(s)`);
    }

    return {
      total,
      breakdown: breakdown.join(', ') || `${days} día(s) a $${pricePerDay}/día`
    };
  }

  async checkAvailability(productId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const existingBookings = await this.prisma.rentalBooking.findMany({
      where: {
        productId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            startDate: { lte: startDate },
            endDate: { gte: startDate }
          },
          {
            startDate: { lte: endDate },
            endDate: { gte: endDate }
          },
          {
            startDate: { gte: startDate },
            endDate: { lte: endDate }
          }
        ]
      }
    });
    return existingBookings.length === 0;
  }

  async createQuote(clientId: string, dto: CreateQuoteDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // For rental quotes, validate dates and check availability
    if (dto.startDate && dto.endDate) {
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const isAvailable = await this.checkAvailability(dto.productId, start, end);
      if (!isAvailable) {
        throw new BadRequestException('Product is not available for the selected dates');
      }

      // Validate minimum rental days
      if (product.minRentalDays && days < product.minRentalDays) {
        throw new BadRequestException(`Minimum rental period is ${product.minRentalDays} days`);
      }
    }

    // Expiration date: 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.prisma.quote.create({
      data: {
        clientId,
        companyId: product.companyId,
        productId: product.id,
        message: dto.message,
        quantity: dto.quantity,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        expiresAt,
      },
    });
  }

  async getMyQuotes(userId: string, role: string, companyId?: string) {
    if (role === 'CLIENT') {
      return this.prisma.quote.findMany({
        where: { clientId: userId },
        include: {
          product: { select: { title: true, slug: true } },
          company: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (companyId) {
      return this.prisma.quote.findMany({
        where: { companyId: companyId },
        include: {
          product: { select: { title: true, slug: true } },
          client: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    
    return [];
  }

  async getQuoteById(id: string, userId: string, role: string, companyId?: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, title: true, slug: true, price: true, currency: true } },
        client: { select: { id: true, firstName: true, lastName: true, email: true } },
        company: { 
          include: { 
            members: { 
              select: { id: true },
              take: 1
            } 
          } 
        },
      }
    });

    if (!quote) throw new NotFoundException('Quote not found');

    if (role === 'CLIENT' && quote.clientId !== userId) {
      throw new UnauthorizedException('Access denied');
    }

    if (role === 'COMPANY_MEMBER' && quote.companyId !== companyId) {
      throw new UnauthorizedException('Access denied');
    }

    return quote;
  }
  
  async respondToQuote(id: string, companyId: string, userId: string, dto: { message: string, status: 'ACCEPTED' | 'REJECTED', price?: number }) {
    const quote = await this.prisma.quote.findUnique({ where: { id } });
    
    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.companyId !== companyId) throw new UnauthorizedException('Not authorized');

    const updated = await this.prisma.quote.update({
      where: { id },
      data: {
        responseMessage: dto.message,
        status: dto.status,
        responsePrice: dto.price,
        responseAt: new Date(),
      }
    });

    // Enviar mensaje automático al chat
    try {
      const thread = await this.prisma.thread.findFirst({ where: { quoteId: id } });
      if (thread) {
        await this.prisma.message.create({
          data: {
            threadId: thread.id,
            senderId: userId,
            content: `[RESPUESTA OFICIAL]: ${dto.message}${dto.price ? ` - Precio propuesto: ${dto.price}` : ''}`,
          }
        });
      }
    } catch (e) {
      console.error('Error creating auto-message:', e);
    }

    return updated;
  }
}
