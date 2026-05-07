import { Controller, Post, Get, Body, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Controller('quotes')
@UseGuards(JwtAuthGuard)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  createQuote(@Request() req: any, @Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesService.createQuote(req.user.id, createQuoteDto);
  }

  @Get('my')
  getMyQuotes(@Request() req: any) {
    return this.quotesService.getMyQuotes(req.user.id, req.user.role, req.user.companyId);
  }

  @Get(':id')
  getQuoteById(@Request() req: any, @Param('id') id: string) {
    return this.quotesService.getQuoteById(id, req.user.id, req.user.role, req.user.companyId);
  }

  @Patch(':id/respond')
  respondToQuote(
    @Request() req: any, 
    @Param('id') id: string, 
    @Body() dto: { message: string, status: 'ACCEPTED' | 'REJECTED', price?: number }
  ) {
    return this.quotesService.respondToQuote(id, req.user.companyId, req.user.id, dto);
  }
}
