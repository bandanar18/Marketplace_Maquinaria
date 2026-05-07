import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getReports(req: any, query: any): Promise<{
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
    deleteReport(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        reason: string;
    }>;
}
