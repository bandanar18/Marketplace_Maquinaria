import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(userId: string, action: string, entity: string, entityId: string, metadata?: any): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        entity: string;
        entityId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
    }>;
    getLogs(query: {
        page?: string;
        limit?: string;
    }): Promise<{
        items: ({
            user: {
                email: string;
                role: import(".prisma/client").$Enums.Role;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            action: string;
            entity: string;
            entityId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
