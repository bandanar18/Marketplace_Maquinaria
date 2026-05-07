import { PrismaService } from '../prisma/prisma.service';
export declare class SupportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTickets(): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        userId: string;
        subject: string;
        priority: import(".prisma/client").$Enums.Priority;
    })[]>;
    updateTicketStatus(id: string, status: any): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        userId: string;
        subject: string;
        priority: import(".prisma/client").$Enums.Priority;
    }>;
    getBroadcasts(): Promise<({
        user: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        title: string;
        message: string;
        userId: string;
        target: string;
    })[]>;
    createBroadcast(adminId: string, data: {
        title: string;
        message: string;
        target: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        message: string;
        userId: string;
        target: string;
    }>;
}
