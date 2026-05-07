"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendMessage(senderId, dto) {
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
        await this.prisma.thread.update({
            where: { id: thread.id },
            data: { lastMessageAt: new Date() }
        });
        return message;
    }
    async getThreadMessages(threadId, userId) {
        const thread = await this.prisma.thread.findUnique({
            where: { id: threadId }
        });
        if (!thread || !thread.participantIds.includes(userId)) {
            throw new common_1.NotFoundException('Thread not found or access denied');
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
    async getMyThreads(userId) {
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
    async getOrCreateThreadByQuoteId(quoteId, userId) {
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
            const quote = await this.prisma.quote.findUnique({
                where: { id: quoteId },
                include: {
                    company: { include: { members: { select: { id: true }, take: 1 } } }
                }
            });
            if (!quote)
                throw new common_1.NotFoundException('Quote not found');
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
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map