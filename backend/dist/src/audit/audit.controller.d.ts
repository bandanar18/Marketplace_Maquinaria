import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getLogs(req: any, query: any): Promise<{
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
