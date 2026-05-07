import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    sendMessage(req: any, dto: any): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        isRead: boolean;
        readAt: Date | null;
        threadId: string;
        senderId: string;
    }>;
    getMyThreads(req: any): Promise<({
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
    getThreadMessages(req: any, id: string): Promise<({
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
    getOrCreateQuoteThread(req: any, quoteId: string): Promise<{
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
