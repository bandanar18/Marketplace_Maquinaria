import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getGlobalStats(): Promise<{
        overview: {
            totalUsers: number;
            totalCompanies: number;
            totalProducts: number;
            totalQuotes: number;
            activeProducts: number;
            pendingProducts: number;
            pendingCompanies: number;
        };
        topProducts: {
            id: string;
            company: {
                name: string;
            };
            title: string;
            viewsCount: number;
        }[];
        dailyStats: {
            date: string;
            quotes: number;
            products: number;
        }[];
    }>;
    exportToCsv(entity: string): Promise<{
        csv: string;
    }>;
}
