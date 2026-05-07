import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleFavorite(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (existing) {
      await this.prisma.favorite.delete({
        where: { id: existing.id }
      });
      // Decrement favoritesCount
      await this.prisma.product.update({
        where: { id: productId },
        data: { favoritesCount: { decrement: 1 } }
      });
      return { favorited: false };
    } else {
      await this.prisma.favorite.create({
        data: { userId, productId }
      });
      // Increment favoritesCount
      await this.prisma.product.update({
        where: { id: productId },
        data: { favoritesCount: { increment: 1 } }
      });
      return { favorited: true };
    }
  }

  async getMyFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { take: 1, orderBy: { order: 'asc' } },
            company: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async isFavorited(userId: string, productId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } }
    });
    return !!favorite;
  }
}
