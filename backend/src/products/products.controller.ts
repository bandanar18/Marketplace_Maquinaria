import { Controller, Get, Post, Body, Param, UseGuards, Request, Query, Patch, UnauthorizedException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createProduct(@Request() req: any, @Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(req.user.companyId, req.user.role, createProductDto);
  }

  @Get()
  getProducts(@Query() query: any) {
    return this.productsService.getProducts(query);
  }

  @Get('detail/:id')
  getProductById(@Param('id') id: string) {
    console.log('--- BACKEND: getProductById REACHED ---');
    console.log('ID PARAM:', id);
    return this.productsService.getProductById(id);
  }

  @Get(':slug')
  getProductBySlug(@Param('slug') slug: string) {
    return this.productsService.getProductBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/boost')
  toggleFeatured(@Request() req: any, @Param('id') id: string) {
    if (!req.user.companyId) throw new UnauthorizedException('No company associated');
    return this.productsService.toggleFeatured(id, req.user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateProduct(@Request() req: any, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, req.user.companyId, updateProductDto);
  }

  // --- ADMIN ENDPOINTS ---

  @UseGuards(JwtAuthGuard)
  @Get('admin/list')
  getAdminProducts(@Request() req: any, @Query() query: any) {
    if (req.user.role !== 'SUPERADMIN') {
      throw new UnauthorizedException('Only SuperAdmins can access this');
    }
    return this.productsService.getAdminProducts(query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateProductStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { status: string; rejectionReason?: string }
  ) {
    if (req.user.role !== 'SUPERADMIN') {
      throw new UnauthorizedException('Only SuperAdmins can modify product status');
    }
    return this.productsService.updateProductStatus(id, body.status, body.rejectionReason);
  }
}
