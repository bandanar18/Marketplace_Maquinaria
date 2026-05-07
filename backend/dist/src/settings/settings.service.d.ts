import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{}>;
    update(key: string, value: string): Promise<{
        updatedAt: Date;
        key: string;
        value: string;
    }>;
    updateMany(configs: Record<string, string>): Promise<{
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
}
