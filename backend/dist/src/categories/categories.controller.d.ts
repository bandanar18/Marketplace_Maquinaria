import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getCategoryTree(): Promise<any[]>;
    createCategory(req: any, dto: any): Promise<{
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
    updateCategory(req: any, id: string, dto: any): Promise<{
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
    deleteCategory(req: any, id: string): Promise<{
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
