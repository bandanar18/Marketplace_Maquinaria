import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getCategoryTree(): Promise<any[]>;
    createCategory(req: any, dto: any): Promise<{
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
    updateCategory(req: any, id: string, dto: any): Promise<{
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
    deleteCategory(req: any, id: string): Promise<{
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
