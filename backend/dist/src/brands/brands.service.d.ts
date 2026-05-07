import { PrismaService } from '../prisma/prisma.service';
export declare class BrandsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
    })[]>;
    create(data: {
        name: string;
        logoUrl?: string;
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
    }>;
    update(id: string, data: {
        name?: string;
        logoUrl?: string;
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
    }>;
}
