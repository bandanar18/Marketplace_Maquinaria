import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCategoryTree(): Promise<any[]>;
    createCategory(dto: any): Promise<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        iconUrl: string | null;
        level: number;
        order: number;
        isActive: boolean;
        parentId: string | null;
    }>;
    updateCategory(id: string, dto: any): Promise<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        iconUrl: string | null;
        level: number;
        order: number;
        isActive: boolean;
        parentId: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        iconUrl: string | null;
        level: number;
        order: number;
        isActive: boolean;
        parentId: string | null;
    }>;
}
