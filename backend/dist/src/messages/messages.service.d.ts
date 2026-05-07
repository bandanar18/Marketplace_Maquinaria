import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    sendMessage(senderId: string, dto: {
        content: string;
        quoteId?: string;
        productId?: string;
        receiverId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        isRead: boolean;
        readAt: Date | null;
        threadId: string;
        senderId: string;
    }>;
    getThreadMessages(threadId: string, userId: string): Promise<({
        sender: {
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        isRead: boolean;
        readAt: Date | null;
        threadId: string;
        senderId: string;
    })[]>;
    getMyThreads(userId: string): Promise<({
        messages: {
            id: string;
            createdAt: Date;
            content: string;
            isRead: boolean;
            readAt: Date | null;
            threadId: string;
            senderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        productId: string | null;
        quoteId: string | null;
        participantIds: string[];
        lastMessageAt: Date | null;
    })[]>;
    getOrCreateThreadByQuoteId(quoteId: string, userId: string): Promise<{
        messages: ({
            sender: {
                id: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            isRead: boolean;
            readAt: Date | null;
            threadId: string;
            senderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        productId: string | null;
        quoteId: string | null;
        participantIds: string[];
        lastMessageAt: Date | null;
    }>;
}
