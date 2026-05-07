import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(senderId: string, dto: { content: string; quoteId?: string; productId?: string; receiverId: string }) {
    // Find or create thread
    let thread = await this.prisma.thread.findFirst({
      where: {
        AND: [
          { participantIds: { has: senderId } },
          { participantIds: { has: dto.receiverId } },
          dto.quoteId ? { quoteId: dto.quoteId } : {},
          dto.productId ? { productId: dto.productId } : {},
        ]
      }
    });

    if (!thread) {
      thread = await this.prisma.thread.create({
        data: {
          participantIds: [senderId, dto.receiverId],
          quoteId: dto.quoteId,
          productId: dto.productId,
        }
      });
    }

    const message = await this.prisma.message.create({
      data: {
        threadId: thread.id,
        senderId,
        content: dto.content,
      }
    });

    // Update lastMessageAt
    await this.prisma.thread.update({
      where: { id: thread.id },
      data: { lastMessageAt: new Date() }
    });

    return message;
  }

  async getThreadMessages(threadId: string, userId: string) {
    const thread = await this.prisma.thread.findUnique({
      where: { id: threadId }
    });

    if (!thread || !thread.participantIds.includes(userId)) {
      throw new NotFoundException('Thread not found or access denied');
    }

    return this.prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { firstName: true, lastName: true, avatarUrl: true }
        }
      }
    });
  }

  async getMyThreads(userId: string) {
    return this.prisma.thread.findMany({
      where: {
        participantIds: { has: userId }
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });
  }

  async getOrCreateThreadByQuoteId(quoteId: string, userId: string) {
    // Find existing thread
    let thread = await this.prisma.thread.findFirst({
      where: { quoteId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
          }
        }
      }
    });

    if (!thread) {
      // Get the quote to find participants
      const quote = await this.prisma.quote.findUnique({
        where: { id: quoteId },
        include: {
          company: { include: { members: { select: { id: true }, take: 1 } } }
        }
      });
      if (!quote) throw new NotFoundException('Quote not found');

      const companyMemberId = quote.company.members[0]?.id;
      const participantIds = [quote.clientId, ...(companyMemberId ? [companyMemberId] : [])];

      thread = await this.prisma.thread.create({
        data: {
          quoteId,
          participantIds,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
            }
          }
        }
      });
    }

    return thread;
  }
}
