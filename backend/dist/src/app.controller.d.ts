import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getAdminStats(req: any): Promise<{
        pendingCompanies: number;
        pendingProducts: number;
        totalUsers: number;
    }>;
}
