import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getGlobalStats(req: any): Promise<{
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
    exportData(req: any, entity: string): Promise<{
        csv: string;
    }>;
}
