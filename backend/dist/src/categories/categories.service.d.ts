import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCategoryTree(): Promise<any[]>;
    createCategory(dto: any): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        iconUrl: string | null;
        parentId: string | null;
        level: number;
        order: number;
        isActive: boolean;
    }>;
    updateCategory(id: string, dto: any): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        iconUrl: string | null;
        parentId: string | null;
        level: number;
        order: number;
        isActive: boolean;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        iconUrl: string | null;
        parentId: string | null;
        level: number;
        order: number;
        isActive: boolean;
    }>;
}
