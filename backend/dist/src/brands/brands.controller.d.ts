import { BrandsService } from './brands.service';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
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
    create(req: any, data: {
        name: string;
        logoUrl?: string;
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
    }>;
    update(req: any, id: string, data: {
        name?: string;
        logoUrl?: string;
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
    }>;
    delete(req: any, id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
    }>;
}
