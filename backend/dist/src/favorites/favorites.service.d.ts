import { PrismaService } from '../prisma/prisma.service';
export declare class FavoritesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    toggleFavorite(userId: string, productId: string): Promise<{
        favorited: boolean;
    }>;
    getMyFavorites(userId: string): Promise<({
        product: {
            company: {
                name: string;
            };
            images: {
                id: string;
                order: number;
                url: string;
                productId: string;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ProductStatus;
            country: string;
            city: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string;
            address: string | null;
            rejectionReason: string | null;
            title: string;
            categoryId: string;
            brand: string;
            model: string;
            year: number;
            condition: import(".prisma/client").$Enums.Condition;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            isNegotiable: boolean;
            availability: import(".prisma/client").$Enums.Availability;
            transactionType: import(".prisma/client").$Enums.TransactionType;
            pricePerDay: import("@prisma/client/runtime/library").Decimal | null;
            pricePerWeek: import("@prisma/client/runtime/library").Decimal | null;
            pricePerMonth: import("@prisma/client/runtime/library").Decimal | null;
            minRentalDays: number | null;
            depositAmount: import("@prisma/client/runtime/library").Decimal | null;
            includesOperator: boolean | null;
            specs: import("@prisma/client/runtime/library").JsonValue | null;
            latitude: number | null;
            longitude: number | null;
            viewsCount: number;
            favoritesCount: number;
            featured: boolean;
            publishedAt: Date | null;
            brandId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
    })[]>;
    isFavorited(userId: string, productId: string): Promise<boolean>;
}
