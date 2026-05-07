import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  sendMessage(@Request() req: any, @Body() dto: any) {
    return this.messagesService.sendMessage(req.user.id, dto);
  }

  @Get('threads')
  getMyThreads(@Request() req: any) {
    return this.messagesService.getMyThreads(req.user.id);
  }

  @Get('thread/:id')
  getThreadMessages(@Request() req: any, @Param('id') id: string) {
    return this.messagesService.getThreadMessages(id, req.user.id);
  }

  @Get('quote-thread/:quoteId')
  getOrCreateQuoteThread(@Request() req: any, @Param('quoteId') quoteId: string) {
    return this.messagesService.getOrCreateThreadByQuoteId(quoteId, req.user.id);
  }
}
