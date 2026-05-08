import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
export declare class QuotesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    calculateRentalPrice(product: any, days: number): {
        total: number;
        breakdown: string;
    };
    checkAvailability(productId: string, startDate: Date, endDate: Date): Promise<boolean>;
    createQuote(clientId: string, dto: CreateQuoteDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.QuoteStatus;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        productId: string;
        clientId: string;
        quantity: number;
        startDate: Date | null;
        endDate: Date | null;
        responseMessage: string | null;
        responsePrice: import("@prisma/client/runtime/library").Decimal | null;
        responseAt: Date | null;
        expiresAt: Date;
    }>;
    getMyQuotes(userId: string, role: string, companyId?: string): Promise<({
        company: {
            name: string;
        };
        product: {
            slug: string;
            title: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.QuoteStatus;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        productId: string;
        clientId: string;
        quantity: number;
        startDate: Date | null;
        endDate: Date | null;
        responseMessage: string | null;
        responsePrice: import("@prisma/client/runtime/library").Decimal | null;
        responseAt: Date | null;
        expiresAt: Date;
    })[] | ({
        product: {
            slug: string;
            title: string;
        };
        client: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.QuoteStatus;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        productId: string;
        clientId: string;
        quantity: number;
        startDate: Date | null;
        endDate: Date | null;
        responseMessage: string | null;
        responsePrice: import("@prisma/client/runtime/library").Decimal | null;
        responseAt: Date | null;
        expiresAt: Date;
    })[]>;
    getQuoteById(id: string, userId: string, role: string, companyId?: string): Promise<{
        company: {
            members: {
                id: string;
            }[];
        } & {
            id: string;
            email: string;
            status: import(".prisma/client").$Enums.CompanyStatus;
            phone: string;
            country: string;
            city: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            taxId: string;
            logoUrl: string | null;
            coverUrl: string | null;
            description: string;
            website: string | null;
            address: string;
            openingHours: import("@prisma/client/runtime/library").JsonValue | null;
            socialMedia: import("@prisma/client/runtime/library").JsonValue | null;
            verifiedAt: Date | null;
            rejectionReason: string | null;
            plan: import(".prisma/client").$Enums.PlanType;
            planExpiresAt: Date | null;
        };
        product: {
            id: string;
            slug: string;
            title: string;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
        };
        client: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.QuoteStatus;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        productId: string;
        clientId: string;
        quantity: number;
        startDate: Date | null;
        endDate: Date | null;
        responseMessage: string | null;
        responsePrice: import("@prisma/client/runtime/library").Decimal | null;
        responseAt: Date | null;
        expiresAt: Date;
    }>;
    respondToQuote(id: string, companyId: string, userId: string, dto: {
        message: string;
        status: 'ACCEPTED' | 'REJECTED';
        price?: number;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.QuoteStatus;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        productId: string;
        clientId: string;
        quantity: number;
        startDate: Date | null;
        endDate: Date | null;
        responseMessage: string | null;
        responsePrice: import("@prisma/client/runtime/library").Decimal | null;
        responseAt: Date | null;
        expiresAt: Date;
    }>;
}
