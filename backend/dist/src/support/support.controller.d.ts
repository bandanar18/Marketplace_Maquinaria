import { SupportService } from './support.service';
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    getTickets(req: any): Promise<({
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
    updateTicketStatus(req: any, id: string, body: {
        status: string;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        userId: string;
        subject: string;
        priority: import(".prisma/client").$Enums.Priority;
    }>;
    getBroadcasts(req: any): Promise<({
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
    createBroadcast(req: any, data: {
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
