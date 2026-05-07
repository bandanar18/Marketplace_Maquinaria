import { Controller, Post, Get, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':productId')
  toggleFavorite(@Request() req: any, @Param('productId') productId: string) {
    return this.favoritesService.toggleFavorite(req.user.id, productId);
  }

  @Get('my')
  getMyFavorites(@Request() req: any) {
    return this.favoritesService.getMyFavorites(req.user.id);
  }

  @Get(':productId/check')
  isFavorited(@Request() req: any, @Param('productId') productId: string) {
    return this.favoritesService.isFavorited(req.user.id, productId);
  }
}
