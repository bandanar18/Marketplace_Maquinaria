import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getReports(query: {
        page?: string;
        limit?: string;
    }): Promise<{
        items: ({
            product: {
                id: string;
                company: {
                    name: string;
                };
                slug: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            reason: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    deleteReport(id: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        reason: string;
    }>;
}
